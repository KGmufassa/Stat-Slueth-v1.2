#!/usr/bin/env python3

import csv
import os
import re
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import List

import kagglehub


DATASET = "sumitrodatta/nba-aba-baa-stats"
FILES = [
    "Opponent Stats Per 100 Poss.csv",
    "Opponent Stats Per Game.csv",
    "Opponent Totals.csv",
    "Per 100 Poss.csv",
    "Per 36 Minutes.csv",
    "Player Career Info.csv",
    "Player Per Game.csv",
    "Player Season Info.csv",
    "Player Shooting.csv",
    "Player Totals.csv",
    "Team Stats Per 100 Poss.csv",
    "Team Stats Per Game.csv",
    "Team Totals.csv",
    "Player Play By Play.csv",
]

FINAL_SCHEMA = '"NBA_Stats"'
STAGING_SCHEMA = '"NBA_STATS_Staging"'


@dataclass
class Config:
    psql_bin: str
    database: str


def quote_ident(name: str) -> str:
    return '"' + name.replace('"', '""') + '"'


def quote_literal(value: str) -> str:
    return "'" + value.replace("'", "''") + "'"


def normalize_column_name(name: str, used: set) -> str:
    normalized = re.sub(r"[^a-z0-9]+", "_", name.strip().lower())
    normalized = normalized.strip("_")
    if not normalized:
        normalized = "col"
    if normalized[0].isdigit():
        normalized = f"c_{normalized}"

    base = normalized
    counter = 2
    while normalized in used:
        normalized = f"{base}_{counter}"
        counter += 1
    used.add(normalized)
    return normalized


def normalize_table_name(file_name: str) -> str:
    base = file_name.replace(".csv", "")
    base = re.sub(r"[^a-z0-9]+", "_", base.lower()).strip("_")
    return f"aba_{base}"


def resolve_psql_bin() -> str:
    candidate = os.environ.get("PSQL_BIN", "")
    if candidate and Path(candidate).exists():
        return candidate

    homebrew_path = "/opt/homebrew/opt/postgresql@18/bin/psql"
    if Path(homebrew_path).exists():
        return homebrew_path

    return "psql"


def run_psql(config: Config, sql: str, capture: bool = True, tuples_only: bool = False) -> str:
    command = [config.psql_bin, "-d", config.database, "-v", "ON_ERROR_STOP=1"]
    if tuples_only:
        command.extend(["-At"])
    command.extend(["-c", sql])
    result = subprocess.run(command, capture_output=True, text=True)
    if result.returncode != 0:
        raise RuntimeError(result.stderr.strip() or result.stdout.strip() or "psql command failed")
    return result.stdout.strip() if capture else ""


def run_psql_copy(config: Config, copy_sql: str) -> None:
    command = [config.psql_bin, "-d", config.database, "-v", "ON_ERROR_STOP=1", "-c", copy_sql]
    result = subprocess.run(command, capture_output=True, text=True)
    if result.returncode != 0:
        raise RuntimeError(result.stderr.strip() or result.stdout.strip() or "psql copy command failed")


def run_psql_scalar(config: Config, sql: str) -> str:
    output = run_psql(config, sql, capture=True, tuples_only=True)
    for line in output.splitlines():
        value = line.strip()
        if value and not value.upper().startswith("INSERT") and not value.upper().startswith("UPDATE"):
            return value
    raise RuntimeError(f"Unable to parse scalar result from SQL output: {output}")


def get_dataset_file_map(dataset_path: Path) -> dict:
    mapping = {}
    for root, _, files in os.walk(dataset_path):
        for file_name in files:
            mapping[file_name] = str(Path(root) / file_name)
    return mapping


def read_csv_headers(csv_path: Path) -> List[str]:
    with csv_path.open("r", encoding="utf-8", newline="") as file_obj:
        reader = csv.reader(file_obj)
        headers = next(reader)
    return headers


def bootstrap(config: Config) -> None:
    run_psql(
        config,
        f"""
        CREATE SCHEMA IF NOT EXISTS {FINAL_SCHEMA};
        CREATE SCHEMA IF NOT EXISTS {STAGING_SCHEMA};

        CREATE TABLE IF NOT EXISTS {FINAL_SCHEMA}.load_runs (
            run_id BIGSERIAL PRIMARY KEY,
            source_dataset TEXT NOT NULL,
            source_file TEXT NOT NULL,
            target_table TEXT NOT NULL,
            started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            finished_at TIMESTAMPTZ,
            status TEXT NOT NULL,
            rows_staging BIGINT,
            rows_inserted BIGINT,
            error_text TEXT
        );
        """,
        capture=False,
    )


def main() -> int:
    config = Config(
        psql_bin=resolve_psql_bin(),
        database=os.environ.get("PGDATABASE", "postgres"),
    )

    print(f"Using psql: {config.psql_bin}")
    print(f"Using database: {config.database}")

    dataset_dir = Path(kagglehub.dataset_download(DATASET))
    print(f"Dataset path: {dataset_dir}")

    file_map = get_dataset_file_map(dataset_dir)
    missing = [file_name for file_name in FILES if file_name not in file_map]
    if missing:
        print("Missing required files:")
        for file_name in missing:
            print(f"- {file_name}")
        return 1

    bootstrap(config)

    for file_name in FILES:
        table_base = normalize_table_name(file_name)
        staging_table = f"{table_base}_raw"
        csv_path = Path(file_map[file_name])

        print(f"\nLoading {file_name}")
        print(f"  source: {csv_path}")
        print(f"  staging: {staging_table}")
        print(f"  final: {table_base}")

        raw_headers = read_csv_headers(csv_path)
        used_names = set()
        normalized_headers = [normalize_column_name(column, used_names) for column in raw_headers]

        header_pairs = list(zip(raw_headers, normalized_headers))
        staging_columns_sql = ",\n            ".join(f"{quote_ident(column)} TEXT" for column in normalized_headers)
        final_data_columns_sql = ",\n            ".join(f"{quote_ident(column)} TEXT" for column in normalized_headers)

        insert_columns = ", ".join([quote_ident(column) for column in normalized_headers] + [
            "source_dataset",
            "source_file",
            "ingested_at",
            "import_key",
        ])

        select_columns = ", ".join(
            [f"NULLIF(BTRIM({quote_ident(column)}), '')" for column in normalized_headers]
            + [
                quote_literal(DATASET),
                quote_literal(file_name),
                "NOW()",
                "md5(concat_ws('|', "
                + ", ".join([f"COALESCE({quote_ident(column)}, '')" for column in normalized_headers])
                + f", {quote_literal(DATASET)}, {quote_literal(file_name)}))",
            ]
        )

        run_id_sql = f"""
            INSERT INTO {FINAL_SCHEMA}.load_runs (source_dataset, source_file, target_table, status)
            VALUES ({quote_literal(DATASET)}, {quote_literal(file_name)}, {quote_literal(table_base)}, 'running')
            RETURNING run_id;
        """

        run_id = run_psql_scalar(config, run_id_sql)

        try:
            create_sql = f"""
                DROP TABLE IF EXISTS {STAGING_SCHEMA}.{quote_ident(staging_table)};
                CREATE TABLE {STAGING_SCHEMA}.{quote_ident(staging_table)} (
                    {staging_columns_sql}
                );

                CREATE TABLE IF NOT EXISTS {FINAL_SCHEMA}.{quote_ident(table_base)} (
                    id BIGSERIAL PRIMARY KEY,
                    {final_data_columns_sql},
                    source_dataset TEXT NOT NULL,
                    source_file TEXT NOT NULL,
                    ingested_at TIMESTAMPTZ NOT NULL,
                    import_key TEXT NOT NULL UNIQUE
                );
            """
            run_psql(config, create_sql, capture=False)

            truncate_sql = f"TRUNCATE TABLE {STAGING_SCHEMA}.{quote_ident(staging_table)};"
            run_psql(config, truncate_sql, capture=False)

            copy_columns = ", ".join(quote_ident(column) for _, column in header_pairs)
            copy_sql = (
                f"\\copy {STAGING_SCHEMA}.{quote_ident(staging_table)} ({copy_columns}) "
                f"FROM {quote_literal(str(csv_path))} WITH (FORMAT csv, HEADER true)"
            )
            run_psql_copy(config, copy_sql)

            staging_count_sql = f"SELECT COUNT(*) FROM {STAGING_SCHEMA}.{quote_ident(staging_table)};"
            staging_count = int(run_psql_scalar(config, staging_count_sql))

            before_count_sql = f"SELECT COUNT(*) FROM {FINAL_SCHEMA}.{quote_ident(table_base)};"
            before_count = int(run_psql_scalar(config, before_count_sql))

            insert_sql = f"""
                INSERT INTO {FINAL_SCHEMA}.{quote_ident(table_base)} ({insert_columns})
                SELECT {select_columns}
                FROM {STAGING_SCHEMA}.{quote_ident(staging_table)}
                ON CONFLICT (import_key) DO NOTHING;
            """
            run_psql(config, insert_sql, capture=False)

            after_count = int(run_psql_scalar(config, before_count_sql))
            inserted_rows = after_count - before_count

            analyze_sql = f"ANALYZE {FINAL_SCHEMA}.{quote_ident(table_base)};"
            run_psql(config, analyze_sql, capture=False)

            success_sql = f"""
                UPDATE {FINAL_SCHEMA}.load_runs
                SET status = 'success',
                    finished_at = NOW(),
                    rows_staging = {staging_count},
                    rows_inserted = {inserted_rows}
                WHERE run_id = {run_id};
            """
            run_psql(config, success_sql, capture=False)

            print(f"  rows_staging={staging_count:,} rows_inserted={inserted_rows:,}")
        except Exception as error:
            message = str(error).replace("'", "''")
            fail_sql = f"""
                UPDATE {FINAL_SCHEMA}.load_runs
                SET status = 'failed',
                    finished_at = NOW(),
                    error_text = '{message}'
                WHERE run_id = {run_id};
            """
            try:
                run_psql(config, fail_sql, capture=False)
            except Exception:
                pass
            print(f"  failed: {error}")
            return 1

    summary_sql = f"""
        SELECT source_file, status, rows_staging, rows_inserted
        FROM {FINAL_SCHEMA}.load_runs
        WHERE source_dataset = {quote_literal(DATASET)}
        ORDER BY run_id DESC
        LIMIT 14;
    """
    print("\nRecent load summary:")
    print(run_psql(config, summary_sql))

    return 0


if __name__ == "__main__":
    sys.exit(main())
