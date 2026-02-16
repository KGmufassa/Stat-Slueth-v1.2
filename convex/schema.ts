import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    titanicPassengers: defineTable({
        passengerId: v.number(),
        age: v.union(v.number(), v.null()),
        fare: v.union(v.number(), v.null()),
        sex: v.union(v.literal(0), v.literal(1), v.null()),
        sibSp: v.union(v.number(), v.null()),
        parch: v.union(v.number(), v.null()),
        pclass: v.union(v.number(), v.null()),
        embarked: v.union(v.number(), v.null()),
        survived: v.union(v.literal(0), v.literal(1), v.null()),
        source: v.string(),
        importKey: v.string(),
    })
        .index("by_import_key", ["importKey"])
        .index("by_passenger_id", ["passengerId"])
        .index("by_survived", ["survived"])
        .index("by_pclass", ["pclass"]),

    nbaPlayers: defineTable({
        personId: v.number(),
        firstName: v.union(v.string(), v.null()),
        lastName: v.union(v.string(), v.null()),
        birthDate: v.union(v.string(), v.null()),
        school: v.union(v.string(), v.null()),
        country: v.union(v.string(), v.null()),
        heightInches: v.union(v.number(), v.null()),
        bodyWeightLbs: v.union(v.number(), v.null()),
        guard: v.union(v.number(), v.null()),
        forward: v.union(v.number(), v.null()),
        center: v.union(v.number(), v.null()),
        draftYear: v.union(v.number(), v.null()),
        draftRound: v.union(v.number(), v.null()),
        draftNumber: v.union(v.number(), v.null()),
        source: v.string(),
        importKey: v.string(),
    })
        .index("by_import_key", ["importKey"])
        .index("by_person_id", ["personId"]),

    nbaTeams: defineTable({
        teamId: v.number(),
        teamCity: v.union(v.string(), v.null()),
        teamName: v.union(v.string(), v.null()),
        teamAbbrev: v.union(v.string(), v.null()),
        seasonFounded: v.union(v.number(), v.null()),
        seasonActiveTill: v.union(v.number(), v.null()),
        league: v.union(v.string(), v.null()),
        source: v.string(),
        importKey: v.string(),
    })
        .index("by_import_key", ["importKey"])
        .index("by_team_id", ["teamId"]),

    nbaGames: defineTable({
        gameId: v.number(),
        gameDateTimeEst: v.union(v.string(), v.null()),
        seasonYear: v.union(v.number(), v.null()),
        homeTeamCity: v.union(v.string(), v.null()),
        homeTeamName: v.union(v.string(), v.null()),
        homeTeamId: v.union(v.number(), v.null()),
        awayTeamCity: v.union(v.string(), v.null()),
        awayTeamName: v.union(v.string(), v.null()),
        awayTeamId: v.union(v.number(), v.null()),
        homeScore: v.union(v.number(), v.null()),
        awayScore: v.union(v.number(), v.null()),
        winnerTeamId: v.union(v.number(), v.null()),
        gameType: v.union(v.string(), v.null()),
        gameSubtype: v.union(v.string(), v.null()),
        gameLabel: v.union(v.string(), v.null()),
        gameSubLabel: v.union(v.string(), v.null()),
        seriesGameNumber: v.union(v.number(), v.null()),
        attendance: v.union(v.number(), v.null()),
        arenaName: v.union(v.string(), v.null()),
        arenaCity: v.union(v.string(), v.null()),
        arenaState: v.union(v.string(), v.null()),
        source: v.string(),
        importKey: v.string(),
    })
        .index("by_import_key", ["importKey"])
        .index("by_game_id", ["gameId"])
        .index("by_season_year", ["seasonYear"]),

    nbaPlayerBoxScores: defineTable({
        personId: v.number(),
        gameId: v.number(),
        gameDateTimeEst: v.union(v.string(), v.null()),
        seasonYear: v.union(v.number(), v.null()),
        firstName: v.union(v.string(), v.null()),
        lastName: v.union(v.string(), v.null()),
        playerTeamCity: v.union(v.string(), v.null()),
        playerTeamName: v.union(v.string(), v.null()),
        opponentTeamCity: v.union(v.string(), v.null()),
        opponentTeamName: v.union(v.string(), v.null()),
        gameType: v.union(v.string(), v.null()),
        gameLabel: v.union(v.string(), v.null()),
        gameSubLabel: v.union(v.string(), v.null()),
        seriesGameNumber: v.union(v.number(), v.null()),
        win: v.union(v.number(), v.null()),
        home: v.union(v.number(), v.null()),
        numMinutes: v.union(v.number(), v.null()),
        points: v.union(v.number(), v.null()),
        assists: v.union(v.number(), v.null()),
        blocks: v.union(v.number(), v.null()),
        steals: v.union(v.number(), v.null()),
        fieldGoalsAttempted: v.union(v.number(), v.null()),
        fieldGoalsMade: v.union(v.number(), v.null()),
        fieldGoalsPercentage: v.union(v.number(), v.null()),
        threePointersAttempted: v.union(v.number(), v.null()),
        threePointersMade: v.union(v.number(), v.null()),
        threePointersPercentage: v.union(v.number(), v.null()),
        freeThrowsAttempted: v.union(v.number(), v.null()),
        freeThrowsMade: v.union(v.number(), v.null()),
        freeThrowsPercentage: v.union(v.number(), v.null()),
        reboundsDefensive: v.union(v.number(), v.null()),
        reboundsOffensive: v.union(v.number(), v.null()),
        reboundsTotal: v.union(v.number(), v.null()),
        foulsPersonal: v.union(v.number(), v.null()),
        turnovers: v.union(v.number(), v.null()),
        plusMinusPoints: v.union(v.number(), v.null()),
        source: v.string(),
        importKey: v.string(),
    })
        .index("by_import_key", ["importKey"])
        .index("by_game_id", ["gameId"])
        .index("by_person_id", ["personId"])
        .index("by_season_year", ["seasonYear"]),
});
