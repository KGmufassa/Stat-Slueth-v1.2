CREATE SCHEMA IF NOT EXISTS "NBA_Stats";
CREATE SCHEMA IF NOT EXISTS "NBA_STATS_Staging";

CREATE TABLE IF NOT EXISTS "NBA_Stats".nba_players (
    id BIGSERIAL PRIMARY KEY,
    person_id BIGINT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    birth_date DATE,
    school TEXT,
    country TEXT,
    height_inches INTEGER,
    body_weight_lbs INTEGER,
    guard INTEGER,
    forward INTEGER,
    center INTEGER,
    draft_year INTEGER,
    draft_round INTEGER,
    draft_number INTEGER,
    source TEXT NOT NULL,
    import_key TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "NBA_Stats".nba_teams (
    id BIGSERIAL PRIMARY KEY,
    team_id BIGINT NOT NULL,
    team_city TEXT,
    team_name TEXT,
    team_abbrev TEXT,
    season_founded INTEGER,
    season_active_till INTEGER,
    league TEXT,
    source TEXT NOT NULL,
    import_key TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "NBA_Stats".nba_games (
    id BIGSERIAL PRIMARY KEY,
    game_id BIGINT NOT NULL,
    game_date_time_est TIMESTAMPTZ,
    season_year INTEGER,
    home_team_city TEXT,
    home_team_name TEXT,
    home_team_id BIGINT,
    away_team_city TEXT,
    away_team_name TEXT,
    away_team_id BIGINT,
    home_score INTEGER,
    away_score INTEGER,
    winner_team_id BIGINT,
    game_type TEXT,
    game_subtype TEXT,
    game_label TEXT,
    game_sub_label TEXT,
    series_game_number INTEGER,
    attendance INTEGER,
    arena_id BIGINT,
    arena_name TEXT,
    arena_city TEXT,
    arena_state TEXT,
    officials TEXT,
    source TEXT NOT NULL,
    import_key TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "NBA_Stats".nba_player_box_scores (
    id BIGSERIAL PRIMARY KEY,
    person_id BIGINT NOT NULL,
    game_id BIGINT NOT NULL,
    game_date_time_est TIMESTAMPTZ,
    season_year INTEGER,
    first_name TEXT,
    last_name TEXT,
    player_team_city TEXT,
    player_team_name TEXT,
    opponent_team_city TEXT,
    opponent_team_name TEXT,
    game_type TEXT,
    game_label TEXT,
    game_sub_label TEXT,
    series_game_number INTEGER,
    win INTEGER,
    home INTEGER,
    num_minutes DOUBLE PRECISION,
    points INTEGER,
    assists INTEGER,
    blocks INTEGER,
    steals INTEGER,
    field_goals_attempted INTEGER,
    field_goals_made INTEGER,
    field_goals_percentage DOUBLE PRECISION,
    three_pointers_attempted INTEGER,
    three_pointers_made INTEGER,
    three_pointers_percentage DOUBLE PRECISION,
    free_throws_attempted INTEGER,
    free_throws_made INTEGER,
    free_throws_percentage DOUBLE PRECISION,
    rebounds_defensive INTEGER,
    rebounds_offensive INTEGER,
    rebounds_total INTEGER,
    fouls_personal INTEGER,
    turnovers INTEGER,
    plus_minus_points INTEGER,
    source TEXT NOT NULL,
    import_key TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "NBA_STATS_Staging".players_raw (
    personId TEXT,
    firstName TEXT,
    lastName TEXT,
    birthDate TEXT,
    school TEXT,
    country TEXT,
    heightInches TEXT,
    bodyWeightLbs TEXT,
    guard TEXT,
    forward TEXT,
    center TEXT,
    draftYear TEXT,
    draftRound TEXT,
    draftNumber TEXT
);

CREATE TABLE IF NOT EXISTS "NBA_STATS_Staging".team_histories_raw (
    teamId TEXT,
    teamCity TEXT,
    teamName TEXT,
    teamAbbrev TEXT,
    seasonFounded TEXT,
    seasonActiveTill TEXT,
    league TEXT
);

CREATE TABLE IF NOT EXISTS "NBA_STATS_Staging".games_raw (
    gameId TEXT,
    gameDateTimeEst TEXT,
    hometeamCity TEXT,
    hometeamName TEXT,
    hometeamId TEXT,
    awayteamCity TEXT,
    awayteamName TEXT,
    awayteamId TEXT,
    homeScore TEXT,
    awayScore TEXT,
    winner TEXT,
    gameType TEXT,
    gameSubtype TEXT,
    gameLabel TEXT,
    gameSubLabel TEXT,
    seriesGameNumber TEXT,
    attendance TEXT,
    arenaId TEXT,
    arenaName TEXT,
    arenaCity TEXT,
    arenaState TEXT,
    officials TEXT
);

CREATE TABLE IF NOT EXISTS "NBA_STATS_Staging".player_statistics_raw (
    firstName TEXT,
    lastName TEXT,
    personId TEXT,
    gameId TEXT,
    gameDateTimeEst TEXT,
    playerteamCity TEXT,
    playerteamName TEXT,
    opponentteamCity TEXT,
    opponentteamName TEXT,
    gameType TEXT,
    gameLabel TEXT,
    gameSubLabel TEXT,
    seriesGameNumber TEXT,
    win TEXT,
    home TEXT,
    numMinutes TEXT,
    points TEXT,
    assists TEXT,
    blocks TEXT,
    steals TEXT,
    fieldGoalsAttempted TEXT,
    fieldGoalsMade TEXT,
    fieldGoalsPercentage TEXT,
    threePointersAttempted TEXT,
    threePointersMade TEXT,
    threePointersPercentage TEXT,
    freeThrowsAttempted TEXT,
    freeThrowsMade TEXT,
    freeThrowsPercentage TEXT,
    reboundsDefensive TEXT,
    reboundsOffensive TEXT,
    reboundsTotal TEXT,
    foulsPersonal TEXT,
    turnovers TEXT,
    plusMinusPoints TEXT
);

INSERT INTO "NBA_Stats".nba_players (
    person_id,
    first_name,
    last_name,
    birth_date,
    school,
    country,
    height_inches,
    body_weight_lbs,
    guard,
    forward,
    center,
    draft_year,
    draft_round,
    draft_number,
    source,
    import_key
)
SELECT
    personId::DOUBLE PRECISION::BIGINT,
    NULLIF(TRIM(firstName), ''),
    NULLIF(TRIM(lastName), ''),
    NULLIF(TRIM(birthDate), '')::DATE,
    NULLIF(TRIM(school), ''),
    NULLIF(TRIM(country), ''),
    NULLIF(TRIM(heightInches), '')::DOUBLE PRECISION::INTEGER,
    NULLIF(TRIM(bodyWeightLbs), '')::DOUBLE PRECISION::INTEGER,
    CASE
        WHEN LOWER(TRIM(guard)) IN ('1', 'true', 't', 'yes') THEN 1
        WHEN LOWER(TRIM(guard)) IN ('0', 'false', 'f', 'no') THEN 0
        ELSE NULL
    END,
    CASE
        WHEN LOWER(TRIM(forward)) IN ('1', 'true', 't', 'yes') THEN 1
        WHEN LOWER(TRIM(forward)) IN ('0', 'false', 'f', 'no') THEN 0
        ELSE NULL
    END,
    CASE
        WHEN LOWER(TRIM(center)) IN ('1', 'true', 't', 'yes') THEN 1
        WHEN LOWER(TRIM(center)) IN ('0', 'false', 'f', 'no') THEN 0
        ELSE NULL
    END,
    NULLIF(TRIM(draftYear), '')::DOUBLE PRECISION::INTEGER,
    NULLIF(TRIM(draftRound), '')::DOUBLE PRECISION::INTEGER,
    NULLIF(TRIM(draftNumber), '')::DOUBLE PRECISION::INTEGER,
    'eoinamoore/historical-nba-data-and-player-box-scores',
    'eoinamoore/historical-nba-data-and-player-box-scores:player:' || personId
FROM "NBA_STATS_Staging".players_raw
WHERE NULLIF(TRIM(personId), '') IS NOT NULL
ON CONFLICT (import_key) DO NOTHING;

INSERT INTO "NBA_Stats".nba_teams (
    team_id,
    team_city,
    team_name,
    team_abbrev,
    season_founded,
    season_active_till,
    league,
    source,
    import_key
)
SELECT
    teamId::DOUBLE PRECISION::BIGINT,
    NULLIF(TRIM(teamCity), ''),
    NULLIF(TRIM(teamName), ''),
    NULLIF(TRIM(teamAbbrev), ''),
    NULLIF(TRIM(seasonFounded), '')::DOUBLE PRECISION::INTEGER,
    NULLIF(TRIM(seasonActiveTill), '')::DOUBLE PRECISION::INTEGER,
    NULLIF(TRIM(league), ''),
    'eoinamoore/historical-nba-data-and-player-box-scores',
    'eoinamoore/historical-nba-data-and-player-box-scores:team:' || teamId || ':' || COALESCE(NULLIF(TRIM(seasonFounded), ''), 'na')
FROM "NBA_STATS_Staging".team_histories_raw
WHERE NULLIF(TRIM(teamId), '') IS NOT NULL
ON CONFLICT (import_key) DO NOTHING;

INSERT INTO "NBA_Stats".nba_games (
    game_id,
    game_date_time_est,
    season_year,
    home_team_city,
    home_team_name,
    home_team_id,
    away_team_city,
    away_team_name,
    away_team_id,
    home_score,
    away_score,
    winner_team_id,
    game_type,
    game_subtype,
    game_label,
    game_sub_label,
    series_game_number,
    attendance,
    arena_id,
    arena_name,
    arena_city,
    arena_state,
    officials,
    source,
    import_key
)
SELECT
    gameId::DOUBLE PRECISION::BIGINT,
    NULLIF(TRIM(gameDateTimeEst), '')::TIMESTAMPTZ,
    LEFT(TRIM(gameDateTimeEst), 4)::INTEGER,
    NULLIF(TRIM(hometeamCity), ''),
    NULLIF(TRIM(hometeamName), ''),
    NULLIF(TRIM(hometeamId), '')::DOUBLE PRECISION::BIGINT,
    NULLIF(TRIM(awayteamCity), ''),
    NULLIF(TRIM(awayteamName), ''),
    NULLIF(TRIM(awayteamId), '')::DOUBLE PRECISION::BIGINT,
    NULLIF(TRIM(homeScore), '')::DOUBLE PRECISION::INTEGER,
    NULLIF(TRIM(awayScore), '')::DOUBLE PRECISION::INTEGER,
    NULLIF(TRIM(winner), '')::DOUBLE PRECISION::BIGINT,
    NULLIF(TRIM(gameType), ''),
    NULLIF(TRIM(gameSubtype), ''),
    NULLIF(TRIM(gameLabel), ''),
    NULLIF(TRIM(gameSubLabel), ''),
    NULLIF(TRIM(seriesGameNumber), '')::DOUBLE PRECISION::INTEGER,
    NULLIF(TRIM(attendance), '')::DOUBLE PRECISION::INTEGER,
    NULLIF(TRIM(arenaId), '')::DOUBLE PRECISION::BIGINT,
    NULLIF(TRIM(arenaName), ''),
    NULLIF(TRIM(arenaCity), ''),
    NULLIF(TRIM(arenaState), ''),
    NULLIF(TRIM(officials), ''),
    'eoinamoore/historical-nba-data-and-player-box-scores',
    'eoinamoore/historical-nba-data-and-player-box-scores:game:' || gameId
FROM "NBA_STATS_Staging".games_raw
WHERE NULLIF(TRIM(gameId), '') IS NOT NULL
  AND LEFT(TRIM(gameDateTimeEst), 4) ~ '^[0-9]{4}$'
  AND LEFT(TRIM(gameDateTimeEst), 4)::INTEGER >= 2000
ON CONFLICT (import_key) DO NOTHING;

INSERT INTO "NBA_Stats".nba_player_box_scores (
    person_id,
    game_id,
    game_date_time_est,
    season_year,
    first_name,
    last_name,
    player_team_city,
    player_team_name,
    opponent_team_city,
    opponent_team_name,
    game_type,
    game_label,
    game_sub_label,
    series_game_number,
    win,
    home,
    num_minutes,
    points,
    assists,
    blocks,
    steals,
    field_goals_attempted,
    field_goals_made,
    field_goals_percentage,
    three_pointers_attempted,
    three_pointers_made,
    three_pointers_percentage,
    free_throws_attempted,
    free_throws_made,
    free_throws_percentage,
    rebounds_defensive,
    rebounds_offensive,
    rebounds_total,
    fouls_personal,
    turnovers,
    plus_minus_points,
    source,
    import_key
)
SELECT
    personId::DOUBLE PRECISION::BIGINT,
    gameId::DOUBLE PRECISION::BIGINT,
    NULLIF(TRIM(gameDateTimeEst), '')::TIMESTAMPTZ,
    LEFT(TRIM(gameDateTimeEst), 4)::INTEGER,
    NULLIF(TRIM(firstName), ''),
    NULLIF(TRIM(lastName), ''),
    NULLIF(TRIM(playerteamCity), ''),
    NULLIF(TRIM(playerteamName), ''),
    NULLIF(TRIM(opponentteamCity), ''),
    NULLIF(TRIM(opponentteamName), ''),
    NULLIF(TRIM(gameType), ''),
    NULLIF(TRIM(gameLabel), ''),
    NULLIF(TRIM(gameSubLabel), ''),
    NULLIF(TRIM(seriesGameNumber), '')::DOUBLE PRECISION::INTEGER,
    NULLIF(TRIM(win), '')::DOUBLE PRECISION::INTEGER,
    NULLIF(TRIM(home), '')::DOUBLE PRECISION::INTEGER,
    NULLIF(TRIM(numMinutes), '')::DOUBLE PRECISION,
    NULLIF(TRIM(points), '')::DOUBLE PRECISION::INTEGER,
    NULLIF(TRIM(assists), '')::DOUBLE PRECISION::INTEGER,
    NULLIF(TRIM(blocks), '')::DOUBLE PRECISION::INTEGER,
    NULLIF(TRIM(steals), '')::DOUBLE PRECISION::INTEGER,
    NULLIF(TRIM(fieldGoalsAttempted), '')::DOUBLE PRECISION::INTEGER,
    NULLIF(TRIM(fieldGoalsMade), '')::DOUBLE PRECISION::INTEGER,
    NULLIF(TRIM(fieldGoalsPercentage), '')::DOUBLE PRECISION,
    NULLIF(TRIM(threePointersAttempted), '')::DOUBLE PRECISION::INTEGER,
    NULLIF(TRIM(threePointersMade), '')::DOUBLE PRECISION::INTEGER,
    NULLIF(TRIM(threePointersPercentage), '')::DOUBLE PRECISION,
    NULLIF(TRIM(freeThrowsAttempted), '')::DOUBLE PRECISION::INTEGER,
    NULLIF(TRIM(freeThrowsMade), '')::DOUBLE PRECISION::INTEGER,
    NULLIF(TRIM(freeThrowsPercentage), '')::DOUBLE PRECISION,
    NULLIF(TRIM(reboundsDefensive), '')::DOUBLE PRECISION::INTEGER,
    NULLIF(TRIM(reboundsOffensive), '')::DOUBLE PRECISION::INTEGER,
    NULLIF(TRIM(reboundsTotal), '')::DOUBLE PRECISION::INTEGER,
    NULLIF(TRIM(foulsPersonal), '')::DOUBLE PRECISION::INTEGER,
    NULLIF(TRIM(turnovers), '')::DOUBLE PRECISION::INTEGER,
    NULLIF(TRIM(plusMinusPoints), '')::DOUBLE PRECISION::INTEGER,
    'eoinamoore/historical-nba-data-and-player-box-scores',
    'eoinamoore/historical-nba-data-and-player-box-scores:box:' || gameId || ':' || personId
FROM "NBA_STATS_Staging".player_statistics_raw
WHERE NULLIF(TRIM(personId), '') IS NOT NULL
  AND NULLIF(TRIM(gameId), '') IS NOT NULL
  AND LEFT(TRIM(gameDateTimeEst), 4) ~ '^[0-9]{4}$'
  AND LEFT(TRIM(gameDateTimeEst), 4)::INTEGER >= 2000
ON CONFLICT (import_key) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_nba_players_person_id ON "NBA_Stats".nba_players (person_id);
CREATE INDEX IF NOT EXISTS idx_nba_teams_team_id ON "NBA_Stats".nba_teams (team_id);
CREATE INDEX IF NOT EXISTS idx_nba_games_game_id ON "NBA_Stats".nba_games (game_id);
CREATE INDEX IF NOT EXISTS idx_nba_games_season_year ON "NBA_Stats".nba_games (season_year);
CREATE INDEX IF NOT EXISTS idx_nba_boxscores_game_id ON "NBA_Stats".nba_player_box_scores (game_id);
CREATE INDEX IF NOT EXISTS idx_nba_boxscores_person_id ON "NBA_Stats".nba_player_box_scores (person_id);
CREATE INDEX IF NOT EXISTS idx_nba_boxscores_season_year ON "NBA_Stats".nba_player_box_scores (season_year);
