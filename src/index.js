import dotenv from "dotenv";
import process from 'process';

import fs from "fs";
import { ALL_SCOPES, createSpotifyClient } from "@tangerie/spotify-manager";
import { sleep } from "./util.js";
import { createClient } from "redis";
import { checkWeekly } from "./weekly.js";
import { checkSummary } from "./summary.js";

dotenv.config();

global.redis = createClient({
    url: process.env.REDIS_SERVER
})

await redis.connect();
console.log("Database Connected");


global.spotify = await createSpotifyClient(redis, ALL_SCOPES);

await redis.select(process.env.REDIS_DB_NUM);

global.me = (await spotify.getMe()).body;

/** @type {import("./index.js").Config} */
global.config = JSON.parse(fs.readFileSync("config/config.json"));


while(true) {
    await checkWeekly();
    await checkSummary();
}

// Pause Execution
process.stdin.resume();