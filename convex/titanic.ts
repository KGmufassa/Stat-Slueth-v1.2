import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const passengerInput = {
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
};

const passengerOutput = v.object({
    _id: v.id("titanicPassengers"),
    _creationTime: v.number(),
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
});

export const upsertBatch = mutation({
    args: {
        rows: v.array(v.object(passengerInput)),
    },
    returns: v.object({
        inserted: v.number(),
        skipped: v.number(),
    }),
    handler: async (ctx, args) => {
        let inserted = 0;
        let skipped = 0;

        for (const row of args.rows) {
            const existing = await ctx.db
                .query("titanicPassengers")
                .withIndex("by_import_key", (q) => q.eq("importKey", row.importKey))
                .first();

            if (existing) {
                skipped += 1;
                continue;
            }

            await ctx.db.insert("titanicPassengers", row);
            inserted += 1;
        }

        return { inserted, skipped };
    },
});

export const getRowCount = query({
    args: {},
    returns: v.number(),
    handler: async (ctx) => {
        const rows = await ctx.db.query("titanicPassengers").collect();
        return rows.length;
    },
});

export const getSampleRows = query({
    args: {
        limit: v.optional(v.number()),
    },
    returns: v.array(passengerOutput),
    handler: async (ctx, args) => {
        const limit = args.limit ?? 10;
        return await ctx.db.query("titanicPassengers").order("asc").take(limit);
    },
});
