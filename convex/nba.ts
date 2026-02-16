import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";

const nullableString = v.union(v.string(), v.null());
const nullableNumber = v.union(v.number(), v.null());

const nbaPlayerInput = {
    personId: v.number(),
    firstName: nullableString,
    lastName: nullableString,
    birthDate: nullableString,
    school: nullableString,
    country: nullableString,
    heightInches: nullableNumber,
    bodyWeightLbs: nullableNumber,
    guard: nullableNumber,
    forward: nullableNumber,
    center: nullableNumber,
    draftYear: nullableNumber,
    draftRound: nullableNumber,
    draftNumber: nullableNumber,
    source: v.string(),
    importKey: v.string(),
};

const nbaTeamInput = {
    teamId: v.number(),
    teamCity: nullableString,
    teamName: nullableString,
    teamAbbrev: nullableString,
    seasonFounded: nullableNumber,
    seasonActiveTill: nullableNumber,
    league: nullableString,
    source: v.string(),
    importKey: v.string(),
};

const nbaGameInput = {
    gameId: v.number(),
    gameDateTimeEst: nullableString,
    seasonYear: nullableNumber,
    homeTeamCity: nullableString,
    homeTeamName: nullableString,
    homeTeamId: nullableNumber,
    awayTeamCity: nullableString,
    awayTeamName: nullableString,
    awayTeamId: nullableNumber,
    homeScore: nullableNumber,
    awayScore: nullableNumber,
    winnerTeamId: nullableNumber,
    gameType: nullableString,
    gameSubtype: nullableString,
    gameLabel: nullableString,
    gameSubLabel: nullableString,
    seriesGameNumber: nullableNumber,
    attendance: nullableNumber,
    arenaName: nullableString,
    arenaCity: nullableString,
    arenaState: nullableString,
    source: v.string(),
    importKey: v.string(),
};

const nbaBoxScoreInput = {
    personId: v.number(),
    gameId: v.number(),
    gameDateTimeEst: nullableString,
    seasonYear: nullableNumber,
    firstName: nullableString,
    lastName: nullableString,
    playerTeamCity: nullableString,
    playerTeamName: nullableString,
    opponentTeamCity: nullableString,
    opponentTeamName: nullableString,
    gameType: nullableString,
    gameLabel: nullableString,
    gameSubLabel: nullableString,
    seriesGameNumber: nullableNumber,
    win: nullableNumber,
    home: nullableNumber,
    numMinutes: nullableNumber,
    points: nullableNumber,
    assists: nullableNumber,
    blocks: nullableNumber,
    steals: nullableNumber,
    fieldGoalsAttempted: nullableNumber,
    fieldGoalsMade: nullableNumber,
    fieldGoalsPercentage: nullableNumber,
    threePointersAttempted: nullableNumber,
    threePointersMade: nullableNumber,
    threePointersPercentage: nullableNumber,
    freeThrowsAttempted: nullableNumber,
    freeThrowsMade: nullableNumber,
    freeThrowsPercentage: nullableNumber,
    reboundsDefensive: nullableNumber,
    reboundsOffensive: nullableNumber,
    reboundsTotal: nullableNumber,
    foulsPersonal: nullableNumber,
    turnovers: nullableNumber,
    plusMinusPoints: nullableNumber,
    source: v.string(),
    importKey: v.string(),
};

export const upsertPlayersBatch = mutation({
    args: { rows: v.array(v.object(nbaPlayerInput)) },
    returns: v.object({ inserted: v.number(), skipped: v.number() }),
    handler: async (ctx, args) => {
        let inserted = 0;
        let skipped = 0;

        for (const row of args.rows) {
            const existing = await ctx.db
                .query("nbaPlayers")
                .withIndex("by_import_key", (q) => q.eq("importKey", row.importKey))
                .first();

            if (existing) {
                skipped += 1;
                continue;
            }

            await ctx.db.insert("nbaPlayers", row);
            inserted += 1;
        }

        return { inserted, skipped };
    },
});

export const upsertTeamsBatch = mutation({
    args: { rows: v.array(v.object(nbaTeamInput)) },
    returns: v.object({ inserted: v.number(), skipped: v.number() }),
    handler: async (ctx, args) => {
        let inserted = 0;
        let skipped = 0;

        for (const row of args.rows) {
            const existing = await ctx.db
                .query("nbaTeams")
                .withIndex("by_import_key", (q) => q.eq("importKey", row.importKey))
                .first();

            if (existing) {
                skipped += 1;
                continue;
            }

            await ctx.db.insert("nbaTeams", row);
            inserted += 1;
        }

        return { inserted, skipped };
    },
});

export const upsertGamesBatch = mutation({
    args: { rows: v.array(v.object(nbaGameInput)) },
    returns: v.object({ inserted: v.number(), skipped: v.number() }),
    handler: async (ctx, args) => {
        let inserted = 0;
        let skipped = 0;

        for (const row of args.rows) {
            const existing = await ctx.db
                .query("nbaGames")
                .withIndex("by_import_key", (q) => q.eq("importKey", row.importKey))
                .first();

            if (existing) {
                skipped += 1;
                continue;
            }

            await ctx.db.insert("nbaGames", row);
            inserted += 1;
        }

        return { inserted, skipped };
    },
});

export const upsertPlayerBoxScoresBatch = mutation({
    args: { rows: v.array(v.object(nbaBoxScoreInput)) },
    returns: v.object({ inserted: v.number(), skipped: v.number() }),
    handler: async (ctx, args) => {
        let inserted = 0;
        let skipped = 0;

        for (const row of args.rows) {
            const existing = await ctx.db
                .query("nbaPlayerBoxScores")
                .withIndex("by_import_key", (q) => q.eq("importKey", row.importKey))
                .first();

            if (existing) {
                skipped += 1;
                continue;
            }

            await ctx.db.insert("nbaPlayerBoxScores", row);
            inserted += 1;
        }

        return { inserted, skipped };
    },
});

export const getImportSample = query({
    args: {
        table: v.union(
            v.literal("nbaPlayers"),
            v.literal("nbaTeams"),
            v.literal("nbaGames"),
            v.literal("nbaPlayerBoxScores")
        ),
        limit: v.optional(v.number()),
    },
    returns: v.array(v.any()),
    handler: async (ctx, args) => {
        const limit = Math.max(1, Math.min(args.limit ?? 5, 25));
        return await ctx.db.query(args.table).order("desc").take(limit);
    },
});

export const getTableCount = query({
    args: {
        table: v.union(
            v.literal("nbaPlayers"),
            v.literal("nbaTeams"),
            v.literal("nbaGames"),
            v.literal("nbaPlayerBoxScores")
        ),
    },
    returns: v.number(),
    handler: async (ctx, args) => {
        const rows = await ctx.db.query(args.table).collect();
        return rows.length;
    },
});

export const getBoxScoreSampleBySeason = query({
    args: {
        seasonYear: v.number(),
        limit: v.optional(v.number()),
    },
    returns: v.array(v.any()),
    handler: async (ctx, args) => {
        const limit = Math.max(1, Math.min(args.limit ?? 5, 25));
        return await ctx.db
            .query("nbaPlayerBoxScores")
            .withIndex("by_season_year", (q) => q.eq("seasonYear", args.seasonYear))
            .order("desc")
            .take(limit);
    },
});

export const listBoxScoresBySeason = query({
    args: {
        seasonYear: v.number(),
        paginationOpts: paginationOptsValidator,
    },
    returns: v.any(),
    handler: async (ctx, args) => {
        return await ctx.db
            .query("nbaPlayerBoxScores")
            .withIndex("by_season_year", (q) => q.eq("seasonYear", args.seasonYear))
            .order("desc")
            .paginate(args.paginationOpts);
    },
});

export const listBoxScoresByGame = query({
    args: {
        gameId: v.number(),
        paginationOpts: paginationOptsValidator,
    },
    returns: v.any(),
    handler: async (ctx, args) => {
        return await ctx.db
            .query("nbaPlayerBoxScores")
            .withIndex("by_game_id", (q) => q.eq("gameId", args.gameId))
            .order("desc")
            .paginate(args.paginationOpts);
    },
});

export const listBoxScoresByPlayer = query({
    args: {
        personId: v.number(),
        paginationOpts: paginationOptsValidator,
    },
    returns: v.any(),
    handler: async (ctx, args) => {
        return await ctx.db
            .query("nbaPlayerBoxScores")
            .withIndex("by_person_id", (q) => q.eq("personId", args.personId))
            .order("desc")
            .paginate(args.paginationOpts);
    },
});
