import "reflect-metadata"; // Required so that typeorm can read the types.
import * as express from "express";
import * as bodyParser from "body-parser";
import * as http from "http";
import { apiRouter } from "../route";

import container from "../inversify.config";
import { WsService } from "../services/ws-service";
import { ServerApp } from "./server-app";

export function startServer(port: number) {
    console.log("Server is starting");

    const app = express();
    app.use("/api", bodyParser.json(), apiRouter);
    const server = http.createServer(app);
    const wsService = container.get(WsService);

    wsService.init(server);
    const serverApp = container.get(ServerApp);

    server.listen(port, async () => {
        console.log("Server is ready");
    }).on("close", async () => {
        console.log("Server is closed");
    });
}
