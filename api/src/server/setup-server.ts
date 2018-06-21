import "reflect-metadata"; // Required so that typeorm can read the types.
import * as express from "express";
import * as bodyParser from "body-parser";
import * as http from "http";
import { apiRouter } from "../route";
import { WebSocketService, IWebSocketMessage } from "../services/web-socket-service";

import container from "../inversify.config";
import { Connection } from "typeorm";

export function startServer(port: number) {
    console.log("Server is starting");

    const app = express();
    app.use("/api", bodyParser.json(), apiRouter);
    const server = http.createServer(app);
    const webSocketService = container.resolve(WebSocketService);
    const databaseProvider = container.get("ConnectionProvider") as (() => Promise<Connection>);
    webSocketService.init(server);


    server.listen(port, async () => {
        let i = 0;
        setInterval(() => {
            i = i + 1;
            webSocketService.broadcastRaw(<IWebSocketMessage>{
                type: "ping",
                seq: i
            });
        }, 1000);

        console.log("Server is ready");
    }).on("close", async () => {
        console.log("Server is closed");
        // Get the database connection and try to close it.
        const database = await databaseProvider();
        database.close();
    });
}
