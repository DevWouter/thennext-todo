import "reflect-metadata"; // Required so that typeorm can read the types.
import * as express from "express";
import * as bodyParser from "body-parser";
import * as http from "http";
import { Connection } from "typeorm";
import { apiRouter } from "../route";

import container from "../inversify.config";
import { WsMessageService } from "../services/ws-message-service";
import { WsService } from "../services/ws-service";

export function startServer(port: number) {
    console.log("Server is starting");

    const app = express();
    app.use("/api", bodyParser.json(), apiRouter);
    const server = http.createServer(app);
    const wsMessageService = container.get(WsMessageService);
    const wsService = container.get(WsService);
    const databaseProvider = container.get("ConnectionProvider") as (() => Promise<Connection>);

    // Setup the message handlers.
    wsMessageService.addCommandHandler("sync-entities", (client, message) => {
        console.log("sync-entities", { client, message });
    });


    wsService.init(server);

    server.listen(port, async () => {
        console.log("Server is ready");
    }).on("close", async () => {
        console.log("Server is closed");
        // Get the database connection and try to close it.
        const database = await databaseProvider();
        database.close();
    });
}
