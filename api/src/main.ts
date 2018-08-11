import "reflect-metadata"; // Required so that typeorm can read the types.
import * as process from 'process';

import { startServer } from "./server";
import { CreateDatabaseConnection } from "./helpers/create-connection";
import { MigrationContext } from "./db/migrations/migration-context";

const procesArguments = process.argv.slice(2);

let showNoArguments = true;
async function main() {
    if (procesArguments.includes("--db-up")) {
        showNoArguments = false;
        // Perform database migration
        const connection = CreateDatabaseConnection();
        console.log("Database Migration: Starting");
        const context = new MigrationContext(connection);
        try {
            await context.up();
            console.log("Database Migration: Completed!");
        } catch (err) {
            console.error("Database Migration: Error!");
            console.error(err);
            process.exit(1); // Error exit
        }
    }

    if (procesArguments.includes("--run")) {
        showNoArguments = false;
        startServer(3000);
    } else if (!showNoArguments) {
        process.exit(0); // Clean exit
    }

    if (showNoArguments) {
        console.warn("No arguments provided");
        console.log("$ node index.js --run         Runs the server");
        console.log("$ node index.js --db-up       Perform database migration");;
    }
}

main().then(() => { });