import { injectable } from "inversify";
import * as http from "http";
import * as WebSocket from "ws";
import {
    IWebSocketMessage,
    WebSocketMessageType,
    ClientRegisterMessage,
    EntityWebSocketMessage
} from "./models/web-socket-messages";

class ClientSocket {
    socket: WebSocket;
    token: string;
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
    private _clients: ClientSocket[] = [];

    constructor() {
        console.log("WebSocketService");
    }

    init(httpServer: http.Server) {
        this._server = new WebSocket.Server({
            server: httpServer
        });
        this._server.on("connection", (ws: WebSocket, req: http.IncomingMessage) => {
            // connection is up, let's add a simple simple event
            let allowPing = true;
            function performPing() {
                try {
                    if (!allowPing) {
                        return;
                    }
                    ws.ping();
                    scheduleNextPing();
                } catch (reason) {
                    console.error(reason);
                }
            }
            function scheduleNextPing() {
                setTimeout(() => {
                    performPing();
                }, 1000);
            }

            ws.on("close", () => {
                allowPing = false;
            });

            performPing();

            ws.on("message", (message_data: string) => {
                // The only message we expect is a client-register.
                const message = JSON.parse(message_data) as IWebSocketMessage;
                if (message.type === WebSocketMessageType.clientRegister) {
                    this.handleClientRegister(ws, message as ClientRegisterMessage);
                }
            });

            // On connect ask the client to identify it self.
            // If a client doesn't identify itself we ignore it.
            // Client registration request is always initiated by the server.
            // That way the server can pass extra information.
            ws.send(JSON.stringify(<IWebSocketMessage>{
                type: "client-registration-request",
            }));
        });
    }

    public sendEntityChange(
        action: "create" | "update" | "delete",
        entityName: "task" | "tasklist" | "checklist" | "relation",
        entity,
        originalToken: string,
    ) {
        console.log(`Sending a message to ${this._clients.length} clients`);
        this._clients.forEach(client => {
            console.log("Sending a message to " + client.token);
            const message = new EntityWebSocketMessage();

            message.action = action;
            message.entityName = entityName;
            message.entity = entity;
            message.isEcho = client.token === originalToken;

            const json_message = JSON.stringify(message);
            client.socket.send(json_message);
        });
    }

    private handleClientRegister(ws: WebSocket, message: ClientRegisterMessage) {
        this.closeClientWithToken(message.token);

        console.log("Register a new WebSocketClient");
        // Create a new client and store it to the list.
        const newClient = new ClientSocket();
        newClient.socket = ws;
        newClient.token = message.token;
        this._clients.push(newClient);
        console.log(`We have ${this._clients.length} clients`);
    }

    private closeClientWithToken(token: string) {
        console.log("Delete a client");
        const i = this._clients.findIndex(c => c.token === token);
        if (i !== -1) {
            const oldClients = this._clients.splice(i, 1);
            oldClients[0].socket.close();
        }
    }
}
