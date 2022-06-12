import dotenv from "dotenv";
import { getAuthedSpotify } from './auth.js';
import { getDatabase } from './database.js';
import process from 'process';

import fs from "fs";

import { checkSummary } from "./summary.js";
import { checkWeekly } from "./weekly.js";
import { Checker } from "./checker.js";

dotenv.config();

const client = getDatabase();

await client.connect();
console.log("Database Connected");

const spotify = await getAuthedSpotify(client);

globalThis.spotify = spotify;
globalThis.redis = client;

/** @type {import("./index.js").Config} */
const config = JSON.parse(fs.readFileSync("config/config.json"));

globalThis.config = config;

await client.disconnect();
console.log("Database Disconnected");


await Checker();
setInterval(Checker, 60 * 1000);

// Pause Execution
process.stdin.resume();