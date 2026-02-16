import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse";
import { ConvexHttpClient } from "convex/browser";

const DATA_DIR = path.resolve("data/nba");
const SOURCE = "eoinamoore/historical-nba-data-and-player-box-scores";
const BATCH_SIZE = Number(process.env.NBA_BATCH_SIZE ?? "250");
const SEASON_START = Number(process.env.NBA_SEASON_START ?? "2020");
const MAX_RETRIES = Number(process.env.NBA_MAX_RETRIES ?? "8");
const RETRY_DELAY_MS = Number(process.env.NBA_RETRY_DELAY_MS ?? "1500");
const IMPORT_TABLES = new Set(
    (process.env.NBA_IMPORT_TABLES ?? "players,teams,games,boxscores")
        .split(",")
        .map((value) => value.trim().toLowerCase())
        .filter(Boolean)
);

function toNullableString(value) {
    if (value === undefined || value === null) {
        return null;
    }
    const trimmed = String(value).trim();
    return trimmed === "" ? null : trimmed;
}

function toNullableNumber(value) {
    const normalized = toNullableString(value);
    if (normalized === null) {
        return null;
    }
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
}

function getSeasonYear(dateTimeValue) {
    const dateText = toNullableString(dateTimeValue);
    if (!dateText) {
        return null;
    }
    const year = Number(dateText.slice(0, 4));
    return Number.isFinite(year) ? year : null;
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runMutationWithRetry(client, mutationName, rows) {
    let attempt = 0;

    while (attempt <= MAX_RETRIES) {
        try {
            return await client.mutation(mutationName, { rows });
        } catch (error) {
            attempt += 1;

            const message = String(error?.message ?? error);
            const isTimeout = message.includes("SystemTimeoutError") || message.includes("timed out");
            if (!isTimeout || attempt > MAX_RETRIES) {
                throw error;
            }

            const waitMs = RETRY_DELAY_MS * attempt;
            console.warn(
                `${mutationName}: timeout on batch(size=${rows.length}), retry ${attempt}/${MAX_RETRIES} in ${waitMs}ms`
            );
            await sleep(waitMs);
        }
    }

    throw new Error(`${mutationName}: retry loop ended unexpectedly.`);
}

async function processCsv({ filePath, mutationName, mapRow }) {
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing input file: ${filePath}`);
    }

    const parser = fs.createReadStream(filePath).pipe(
        parse({
            columns: true,
            skip_empty_lines: true,
            relax_column_count: true,
            bom: true,
            trim: true,
        })
    );

    const client = new ConvexHttpClient(process.env.CONVEX_URL);

    let batch = [];
    let processed = 0;
    let considered = 0;
    let inserted = 0;
    let skipped = 0;

    for await (const record of parser) {
        considered += 1;
        const normalized = mapRow(record);
        if (!normalized) {
            continue;
        }

        processed += 1;
        batch.push(normalized);

        if (batch.length >= BATCH_SIZE) {
            const result = await runMutationWithRetry(client, mutationName, batch);
            inserted += result.inserted;
            skipped += result.skipped;
            batch = [];

            if ((inserted + skipped) % (BATCH_SIZE * 10) === 0) {
                console.log(
                    `${mutationName}: considered=${considered} processed=${processed} inserted=${inserted} skipped=${skipped}`
                );
            }
        }
    }

    if (batch.length > 0) {
        const result = await runMutationWithRetry(client, mutationName, batch);
        inserted += result.inserted;
        skipped += result.skipped;
    }

    console.log(
        `${mutationName}: done considered=${considered} processed=${processed} inserted=${inserted} skipped=${skipped}`
    );

    return { considered, processed, inserted, skipped };
}

function mapPlayerRow(row) {
    const personId = toNullableNumber(row.personId);
    if (personId === null) {
        return null;
    }

    return {
        personId,
        firstName: toNullableString(row.firstName),
        lastName: toNullableString(row.lastName),
        birthDate: toNullableString(row.birthDate),
        school: toNullableString(row.school),
        country: toNullableString(row.country),
        heightInches: toNullableNumber(row.heightInches),
        bodyWeightLbs: toNullableNumber(row.bodyWeightLbs),
        guard: toNullableNumber(row.guard),
        forward: toNullableNumber(row.forward),
        center: toNullableNumber(row.center),
        draftYear: toNullableNumber(row.draftYear),
        draftRound: toNullableNumber(row.draftRound),
        draftNumber: toNullableNumber(row.draftNumber),
        source: SOURCE,
        importKey: `${SOURCE}:player:${personId}`,
    };
}

function mapTeamHistoryRow(row) {
    const teamId = toNullableNumber(row.teamId);
    const seasonFounded = toNullableNumber(row.seasonFounded);
    if (teamId === null) {
        return null;
    }

    return {
        teamId,
        teamCity: toNullableString(row.teamCity),
        teamName: toNullableString(row.teamName),
        teamAbbrev: toNullableString(row.teamAbbrev),
        seasonFounded,
        seasonActiveTill: toNullableNumber(row.seasonActiveTill),
        league: toNullableString(row.league),
        source: SOURCE,
        importKey: `${SOURCE}:team:${teamId}:${seasonFounded ?? "na"}`,
    };
}

function mapGameRow(row) {
    const gameId = toNullableNumber(row.gameId);
    const seasonYear = getSeasonYear(row.gameDateTimeEst);
    if (gameId === null || (seasonYear !== null && seasonYear < SEASON_START)) {
        return null;
    }

    return {
        gameId,
        gameDateTimeEst: toNullableString(row.gameDateTimeEst),
        seasonYear,
        homeTeamCity: toNullableString(row.hometeamCity),
        homeTeamName: toNullableString(row.hometeamName),
        homeTeamId: toNullableNumber(row.hometeamId),
        awayTeamCity: toNullableString(row.awayteamCity),
        awayTeamName: toNullableString(row.awayteamName),
        awayTeamId: toNullableNumber(row.awayteamId),
        homeScore: toNullableNumber(row.homeScore),
        awayScore: toNullableNumber(row.awayScore),
        winnerTeamId: toNullableNumber(row.winner),
        gameType: toNullableString(row.gameType),
        gameSubtype: toNullableString(row.gameSubtype),
        gameLabel: toNullableString(row.gameLabel),
        gameSubLabel: toNullableString(row.gameSubLabel),
        seriesGameNumber: toNullableNumber(row.seriesGameNumber),
        attendance: toNullableNumber(row.attendance),
        arenaName: toNullableString(row.arenaName),
        arenaCity: toNullableString(row.arenaCity),
        arenaState: toNullableString(row.arenaState),
        source: SOURCE,
        importKey: `${SOURCE}:game:${gameId}`,
    };
}

function mapPlayerStatRow(row) {
    const personId = toNullableNumber(row.personId);
    const gameId = toNullableNumber(row.gameId);
    const seasonYear = getSeasonYear(row.gameDateTimeEst);
    if (personId === null || gameId === null || (seasonYear !== null && seasonYear < SEASON_START)) {
        return null;
    }

    return {
        personId,
        gameId,
        gameDateTimeEst: toNullableString(row.gameDateTimeEst),
        seasonYear,
        firstName: toNullableString(row.firstName),
        lastName: toNullableString(row.lastName),
        playerTeamCity: toNullableString(row.playerteamCity),
        playerTeamName: toNullableString(row.playerteamName),
        opponentTeamCity: toNullableString(row.opponentteamCity),
        opponentTeamName: toNullableString(row.opponentteamName),
        gameType: toNullableString(row.gameType),
        gameLabel: toNullableString(row.gameLabel),
        gameSubLabel: toNullableString(row.gameSubLabel),
        seriesGameNumber: toNullableNumber(row.seriesGameNumber),
        win: toNullableNumber(row.win),
        home: toNullableNumber(row.home),
        numMinutes: toNullableNumber(row.numMinutes),
        points: toNullableNumber(row.points),
        assists: toNullableNumber(row.assists),
        blocks: toNullableNumber(row.blocks),
        steals: toNullableNumber(row.steals),
        fieldGoalsAttempted: toNullableNumber(row.fieldGoalsAttempted),
        fieldGoalsMade: toNullableNumber(row.fieldGoalsMade),
        fieldGoalsPercentage: toNullableNumber(row.fieldGoalsPercentage),
        threePointersAttempted: toNullableNumber(row.threePointersAttempted),
        threePointersMade: toNullableNumber(row.threePointersMade),
        threePointersPercentage: toNullableNumber(row.threePointersPercentage),
        freeThrowsAttempted: toNullableNumber(row.freeThrowsAttempted),
        freeThrowsMade: toNullableNumber(row.freeThrowsMade),
        freeThrowsPercentage: toNullableNumber(row.freeThrowsPercentage),
        reboundsDefensive: toNullableNumber(row.reboundsDefensive),
        reboundsOffensive: toNullableNumber(row.reboundsOffensive),
        reboundsTotal: toNullableNumber(row.reboundsTotal),
        foulsPersonal: toNullableNumber(row.foulsPersonal),
        turnovers: toNullableNumber(row.turnovers),
        plusMinusPoints: toNullableNumber(row.plusMinusPoints),
        source: SOURCE,
        importKey: `${SOURCE}:box:${gameId}:${personId}`,
    };
}

async function run() {
    if (!process.env.CONVEX_URL) {
        throw new Error("Missing CONVEX_URL. Load .env.local first.");
    }

    console.log(`Starting NBA import with season filter >= ${SEASON_START}`);

    if (IMPORT_TABLES.has("players")) {
        await processCsv({
            filePath: path.join(DATA_DIR, "Players.csv"),
            mutationName: "nba:upsertPlayersBatch",
            mapRow: mapPlayerRow,
        });
    }

    if (IMPORT_TABLES.has("teams")) {
        await processCsv({
            filePath: path.join(DATA_DIR, "TeamHistories.csv"),
            mutationName: "nba:upsertTeamsBatch",
            mapRow: mapTeamHistoryRow,
        });
    }

    if (IMPORT_TABLES.has("games")) {
        await processCsv({
            filePath: path.join(DATA_DIR, "Games.csv"),
            mutationName: "nba:upsertGamesBatch",
            mapRow: mapGameRow,
        });
    }

    if (IMPORT_TABLES.has("boxscores")) {
        await processCsv({
            filePath: path.join(DATA_DIR, "PlayerStatistics.csv"),
            mutationName: "nba:upsertPlayerBoxScoresBatch",
            mapRow: mapPlayerStatRow,
        });
    }

    console.log("NBA import completed.");
}

run().catch((error) => {
    console.error(error.message);
    process.exit(1);
});
