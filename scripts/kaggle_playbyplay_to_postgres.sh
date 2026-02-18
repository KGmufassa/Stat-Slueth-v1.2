#!/usr/bin/env bash
set -euo pipefail

# Kaggle -> Download specific Parquet -> Load into Postgres via DuckDB
# Replace mode: overwrites final table after successful staging load.

KAGGLE_DATASET="eoinamoore/historical-nba-data-and-player-box-scores"
KAGGLE_FILE="PlayByPlay.parquet"

PG_USER="${PG_USER:-will}"
PG_PASSWORD="${PG_PASSWORD:-}"
PG_HOST="${PG_HOST:-127.0.0.1}"
PG_PORT="${PG_PORT:-5432}"
PG_DB="${PG_DB:-postgres}"

STAGING_SCHEMA="${STAGING_SCHEMA:-NBA_STATS_Staging}"
FINAL_SCHEMA="${FINAL_SCHEMA:-NBA_Stats}"
FINAL_TABLE="${FINAL_TABLE:-play_by_play}"
TMP_TABLE="${TMP_TABLE:-play_by_play_raw_new}"

DOWNLOAD_DIR="${DOWNLOAD_DIR:-$HOME/Downloads/kaggle_import}"

mkdir -p "$DOWNLOAD_DIR"
mkdir -p "/tmp/duckdb_tmp"

echo "1) Downloading from Kaggle: $KAGGLE_DATASET (file: $KAGGLE_FILE)"
kaggle datasets download -d "$KAGGLE_DATASET" --file "$KAGGLE_FILE" -p "$DOWNLOAD_DIR" --unzip

PARQUET_PATH="$DOWNLOAD_DIR/$KAGGLE_FILE"
if [[ ! -f "$PARQUET_PATH" ]]; then
    echo "ERROR: Expected file not found at: $PARQUET_PATH"
    ls -la "$DOWNLOAD_DIR"
    exit 1
fi

echo "2) Loading into staging and replacing final table"

PG_CONN="dbname=${PG_DB} host=${PG_HOST} port=${PG_PORT} user=${PG_USER}"
if [[ -n "$PG_PASSWORD" ]]; then
    PG_CONN+=" password=${PG_PASSWORD}"
fi

PGOPTIONS='-c statement_timeout=0 -c lock_timeout=30000' duckdb <<SQL
SET threads=4;
SET memory_limit='4GB';
SET temp_directory='/tmp/duckdb_tmp';

INSTALL postgres;
LOAD postgres;

ATTACH '${PG_CONN}' AS pg (TYPE postgres);

CREATE SCHEMA IF NOT EXISTS pg."${STAGING_SCHEMA}";
CREATE SCHEMA IF NOT EXISTS pg."${FINAL_SCHEMA}";

DROP TABLE IF EXISTS pg."${STAGING_SCHEMA}"."${TMP_TABLE}";

CREATE TABLE pg."${STAGING_SCHEMA}"."${TMP_TABLE}" AS
SELECT * FROM read_parquet('${PARQUET_PATH}');

SELECT COUNT(*) AS staging_row_count
FROM pg."${STAGING_SCHEMA}"."${TMP_TABLE}";

BEGIN TRANSACTION;
DROP TABLE IF EXISTS pg."${FINAL_SCHEMA}"."${FINAL_TABLE}";
CREATE TABLE pg."${FINAL_SCHEMA}"."${FINAL_TABLE}" AS
SELECT * FROM pg."${STAGING_SCHEMA}"."${TMP_TABLE}";
COMMIT;

SELECT COUNT(*) AS final_row_count
FROM pg."${FINAL_SCHEMA}"."${FINAL_TABLE}";
SQL

echo "3) Done."
echo "   View in pgAdmin: Databases -> ${PG_DB} -> Schemas -> ${FINAL_SCHEMA} -> Tables -> ${FINAL_TABLE}"
