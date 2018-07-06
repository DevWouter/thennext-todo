import { Subject, Observable } from "rxjs";
import { injectable } from "inversify";
import * as http from "http";
import * as WebSocket from "ws";

export interface WsClient {
    readonly id: number;
    readonly socket: WebSocket;
}

export interface WsMessageEvent {
    /**
     * The client sending the message.
     */
    readonly clientId: number;

    /**
     * The message that was send.
     */
    readonly message: string;
}

/**
 * The WebSocket Service keeps track of connections
 */
@injectable()
export class WsService {
    private _server: WebSocket.Server = undefined;
    private _nextClientId = 0;
    private _clients: WsClient[] = [];
    private $message = new Subject<WsMessageEvent>();
    private $newClientEvent = new Subject<number>();
    private $closedClientEvent = new Subject<number>();

    public get message(): Observable<WsMessageEvent> { return this.$message; }
    public get newClientEvent(): Observable<number> { return this.$newClientEvent; }
    public get closedClientEvent(): Observable<number> { return this.$closedClientEvent; }

    public init(httpServer: http.Server) {
        this._server = new WebSocket.Server({
            server: httpServer
        });

        this._server.on("connection", (ws: WebSocket, req: http.IncomingMessage) => {
            const client = this.addClient(ws);
            const pingInterval = setInterval(() => {
                try {
                    ws.ping();
                } catch (reason) {
                    this.onError(client, reason);
                    clearInterval(pingInterval);
                }
            }, 15000);
            ws.on("message", (data) => { this.onMessage(client, data as string); });
            ws.on("close", (code, reason) => {
                this.onClose(client, code, reason);
                clearInterval(pingInterval);
            });
            ws.on("error", (err) => {
                this.onError(client, err);
                clearInterval(pingInterval);
            });
        });
    }

    public close(clientId: number, code: number, reason: string): void {
        const index = this._clients.findIndex(c => c.id === clientId);
        const client = this._clients[index];
        if (index === -1) {
            console.error(`Trying to close a client that is not listed. Id: ${client.id}`);
            return;
        }

        this._clients.splice(index, 1);

        try {
            client.socket.close(code, reason);
        } catch (error) {
            console.warn(`Error while trying to close client ${client.id}`, error);
        }
    }

    public send(clientId: number, message: string): void {
        const client = this._clients.find(x => x.id === clientId);
        if (!client) {
            throw new Error(`Client with id ${clientId} is not available`);
        }

        client.socket.send(message, (err) => {
            // Report if an error has occured.
            if (err) {
                console.error(`Error while sending message to client ${clientId}`, err);
            }
        });
    }

    private onMessage(client: WsClient, data: string): void {
        // Inform the listener about the message.
        this.$message.next({
            clientId: client.id,
            message: data,
        });
    }

    private onClose(client: WsClient, code: number, reason: string): void {
        console.log(`Client ${client.id} has closed the connection (code: ${code}, reason: ${reason})`);
        this.removeClient(client);
    }

    private onError(client: WsClient, error: Error): void {
        console.warn(`Client ${client.id} has had an error`, error);
        this.removeClient(client, true, "Removing due to error: " + error.message);
    }

    private removeClient(client: WsClient, tryClose = false, removeReason?: string) {
        const index = this._clients.indexOf(client);
        if (index === -1) {
            return;
        }

        this._clients.splice(index, 1);
        this.$closedClientEvent.next(client.id);
        if (tryClose) {
            try {
                client.socket.close(4000, removeReason);
            } catch (error) {
                console.warn(`Error while trying to remove client ${client.id}`, error);
            }
        }
    }

    private addClient(ws: WebSocket): WsClient {
        const client = <WsClient>{
            id: this.getNextSafeId(),
            socket: ws
        };

        this._clients.push(client);
        console.log(`Client ${client.id} was added`);
        this.$newClientEvent.next(client.id);
        return client;
    }

    private getNextSafeId(): number {
        let counterWasReset = false;
        do {
            // Increase the number if already taken.
            if (this._clients.some(x => x.id === this._nextClientId)) {
                this._nextClientId++;
                continue; // Jumps back to do.
            }

            // Start
            if (this._nextClientId >= Number.MAX_SAFE_INTEGER) {
                if (counterWasReset) {
                    throw new Error(`No available id found in the range 0...${Number.MAX_SAFE_INTEGER}`);
                }

                // Start over from zero, and keep track that the counter was already reset.
                this._nextClientId = 0;
                counterWasReset = true;

                continue; // Jump back to do.
            }

        } while (false);

        const currentId = this._nextClientId;
        this._nextClientId++; // The id is now taken, so increase the number.
        return currentId;
    }
}
