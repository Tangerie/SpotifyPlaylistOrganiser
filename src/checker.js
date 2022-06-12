import { checkSummary } from "./summary.js";
import { checkWeekly } from "./weekly.js";

export const Checker = async () => {
    await redis.connect();
    console.log("Database Connected");

    await Promise.all([
        checkSummary(),
        checkWeekly()
    ]);

    await redis.disconnect();
    console.log("Database Disconnected");
}