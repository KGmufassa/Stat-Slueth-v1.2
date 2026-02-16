import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";
import { ConvexHttpClient } from "convex/browser";

const DATA_FILE = path.resolve("data/train_and_test2.csv");
const BATCH_SIZE = 200;

function parseNumber(value) {
    if (value === undefined || value === null || value === "") {
        return null;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
}

function parseZeroOne(value) {
    const parsed = parseNumber(value);
    if (parsed === 0 || parsed === 1) {
        return parsed;
    }
    return null;
}

function chunk(array, size) {
    const chunks = [];
    for (let index = 0; index < array.length; index += size) {
        chunks.push(array.slice(index, index + size));
    }
    return chunks;
}

function normalizeRow(row) {
    const passengerId = parseNumber(row.Passengerid);
    if (passengerId === null) {
        return null;
    }

    return {
        passengerId,
        age: parseNumber(row.Age),
        fare: parseNumber(row.Fare),
        sex: parseZeroOne(row.Sex),
        sibSp: parseNumber(row.sibsp),
        parch: parseNumber(row.Parch),
        pclass: parseNumber(row.Pclass),
        embarked: parseNumber(row.Embarked),
        survived: parseZeroOne(row["2urvived"]),
        source: "heptapod/titanic",
        importKey: `heptapod/titanic:${passengerId}`,
    };
}

async function run() {
    const convexUrl = process.env.CONVEX_URL;
    if (!convexUrl) {
        throw new Error("Missing CONVEX_URL. Set it before running import:titanic.");
    }

    if (!fs.existsSync(DATA_FILE)) {
        throw new Error(`Missing CSV file: ${DATA_FILE}`);
    }

    const csvRaw = fs.readFileSync(DATA_FILE, "utf8");
    const records = parse(csvRaw, {
        columns: true,
        skip_empty_lines: true,
        relax_column_count: true,
        trim: true,
    });

    const normalizedRows = records.map(normalizeRow).filter(Boolean);
    const client = new ConvexHttpClient(convexUrl);

    let inserted = 0;
    let skipped = 0;

    const batches = chunk(normalizedRows, BATCH_SIZE);
    for (let index = 0; index < batches.length; index += 1) {
        const batch = batches[index];
        const result = await client.mutation("titanic:upsertBatch", { rows: batch });
        inserted += result.inserted;
        skipped += result.skipped;
        console.log(
            `[${index + 1}/${batches.length}] inserted=${result.inserted} skipped=${result.skipped}`
        );
    }

    console.log(`Import finished. totalRows=${normalizedRows.length} inserted=${inserted} skipped=${skipped}`);
}

run().catch((error) => {
    console.error(error.message);
    process.exit(1);
});
