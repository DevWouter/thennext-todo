import { injectable } from "inversify";
import * as http from "http";
import * as WebSocket from "ws";


export interface IWebSocketMessage {
    type: string;
}

/**
 * The WebSocket is the lowest service we have available for communicating to
 * other clients. It keeps track of the available connections this instance
 * has and allows sending and listening to messages. It will *not* handle
 * messages or clients that are connected on another api instance.
 * To do so the service provides `WebSocketClient`'s. These are objects act
 * as keys and can be used for storing additional information.
 * The "Clients" however do not actually contain a connection. So this is
 * more enity component system.
 */
@injectable()
export class WebSocketService {
    private _server: WebSocket.Server = undefined;
    constructor() {
    }

    broadcastRaw(message: IWebSocketMessage) {
        this._server.clients.forEach(client => {
            client.send(JSON.stringify(message));
        });
    }

    init(httpServer: http.Server) {
        this._server = new WebSocket.Server({
            server: httpServer
        });
        this._server.on("connection", (ws: WebSocket) => {
            // connection is up, let's add a simple simple event
            ws.on("message", (message: string) => {
                // log the received message and send it back to the client
                console.log("received: %s", message);
                ws.send(`Hello, you sent -> ${message}`);
            });
            // send immediatly a feedback to the incoming connection
            ws.send(JSON.stringify(<IWebSocketMessage>{
                type: "connected",
                message: "This is the first message from the server telling you are now connected through the websocket"
            }));
        });
    }
}
