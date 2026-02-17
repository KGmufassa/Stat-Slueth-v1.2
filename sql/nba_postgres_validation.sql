SELECT 'nba_players' AS table_name, COUNT(*) AS row_count FROM "NBA_Stats".nba_players
UNION ALL
SELECT 'nba_teams' AS table_name, COUNT(*) AS row_count FROM "NBA_Stats".nba_teams
UNION ALL
SELECT 'nba_games' AS table_name, COUNT(*) AS row_count FROM "NBA_Stats".nba_games
UNION ALL
SELECT 'nba_player_box_scores' AS table_name, COUNT(*) AS row_count FROM "NBA_Stats".nba_player_box_scores
ORDER BY table_name;

SELECT
    COUNT(*) FILTER (WHERE season_year < 2000 OR season_year IS NULL) AS invalid_games,
    MIN(season_year) AS min_game_season,
    MAX(season_year) AS max_game_season
FROM "NBA_Stats".nba_games;

SELECT
    COUNT(*) FILTER (WHERE season_year < 2000 OR season_year IS NULL) AS invalid_boxscores,
    MIN(season_year) AS min_box_season,
    MAX(season_year) AS max_box_season
FROM "NBA_Stats".nba_player_box_scores;

SELECT
    COUNT(*) - COUNT(DISTINCT import_key) AS duplicate_import_keys
FROM "NBA_Stats".nba_player_box_scores;

SELECT
    game_date_time_est,
    first_name,
    last_name,
    player_team_name,
    opponent_team_name,
    points,
    assists,
    rebounds_total
FROM "NBA_Stats".nba_player_box_scores
WHERE season_year = 2023
ORDER BY game_date_time_est DESC NULLS LAST
LIMIT 10;
