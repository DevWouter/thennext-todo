import "reflect-metadata"; // Required so that typeorm can read the types.
import * as express from "express";
import * as bodyParser from "body-parser";
import { createConnection, Connection } from "typeorm";

import { apiRouter } from "../route";

export function startServer(port: number) {
    console.log("Server is starting");

    const app = express();
    app.use("/api", bodyParser.json(), apiRouter);

    let connection: Connection;
    app.listen(port, async () => {
        connection = await createConnection();
        console.log("Server is ready");
    }).on("close", () => {
        connection.close();
        console.log("Server is closed");
    });
}
