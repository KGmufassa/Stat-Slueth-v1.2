#!/usr/bin/env bash

set -euo pipefail

PSQL_BIN="${PSQL_BIN:-/opt/homebrew/opt/postgresql@18/bin/psql}"
PGDATABASE="${PGDATABASE:-postgres}"
ROOT_DIR="$(pwd)"

PLAYERS_CSV="${ROOT_DIR}/data/nba/Players.csv"
TEAMS_CSV="${ROOT_DIR}/data/nba/TeamHistories.csv"
GAMES_CSV="${ROOT_DIR}/data/nba/Games.csv"
BOXSCORES_CSV="${ROOT_DIR}/data/nba/PlayerStatistics.csv"

for file in "$PLAYERS_CSV" "$TEAMS_CSV" "$GAMES_CSV" "$BOXSCORES_CSV"; do
    if [[ ! -f "$file" ]]; then
        echo "Missing input file: $file"
        exit 1
    fi
done

if [[ ! -x "$PSQL_BIN" ]]; then
    echo "psql binary not executable at: $PSQL_BIN"
    echo "Set PSQL_BIN=/path/to/psql and run again."
    exit 1
fi

echo "Creating/validating Postgres schemas and tables"
"$PSQL_BIN" -d "$PGDATABASE" -v ON_ERROR_STOP=1 -f "${ROOT_DIR}/sql/nba_postgres_2000plus.sql"

echo "Refreshing staging tables from CSV files"
"$PSQL_BIN" -d "$PGDATABASE" -v ON_ERROR_STOP=1 -c "TRUNCATE TABLE \"NBA_STATS_Staging\".players_raw, \"NBA_STATS_Staging\".team_histories_raw, \"NBA_STATS_Staging\".games_raw, \"NBA_STATS_Staging\".player_statistics_raw"
"$PSQL_BIN" -d "$PGDATABASE" -v ON_ERROR_STOP=1 -c "\\copy \"NBA_STATS_Staging\".players_raw FROM '$PLAYERS_CSV' WITH (FORMAT csv, HEADER true)"
"$PSQL_BIN" -d "$PGDATABASE" -v ON_ERROR_STOP=1 -c "\\copy \"NBA_STATS_Staging\".team_histories_raw FROM '$TEAMS_CSV' WITH (FORMAT csv, HEADER true)"
"$PSQL_BIN" -d "$PGDATABASE" -v ON_ERROR_STOP=1 -c "\\copy \"NBA_STATS_Staging\".games_raw FROM '$GAMES_CSV' WITH (FORMAT csv, HEADER true)"
"$PSQL_BIN" -d "$PGDATABASE" -v ON_ERROR_STOP=1 -c "\\copy \"NBA_STATS_Staging\".player_statistics_raw FROM '$BOXSCORES_CSV' WITH (FORMAT csv, HEADER true)"

echo "Loading 2000+ seasons into analytics tables"
"$PSQL_BIN" -d "$PGDATABASE" -v ON_ERROR_STOP=1 -f "${ROOT_DIR}/sql/nba_postgres_2000plus.sql"

echo "Running validation checks"
"$PSQL_BIN" -d "$PGDATABASE" -v ON_ERROR_STOP=1 -f "${ROOT_DIR}/sql/nba_postgres_validation.sql"

echo "Postgres import complete."
