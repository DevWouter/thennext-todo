import { injectable } from "inversify";
import { Subscription, Subject } from "rxjs";
import { filter } from "rxjs/operators";

import { WsService } from "./ws-service";
import { WsCommandMap } from "./ws/commands";
import { AccountService } from "./account-service";
import { TokenRejectedEvent, WsEventMap } from "./ws/events";
import { WsMessageClient, TrustedClient } from "./ws/message-client";

interface CommandMessage {
    client: TrustedClient;
    type: keyof WsCommandMap;
    message: object;
}

@injectable()
export class WsMessageService {
    private readonly _newClients: WsMessageClient[] = [];
    private readonly _trustedClients: TrustedClient[] = [];

    private readonly $commandMessage = new Subject<CommandMessage>();
    private readonly _handlerCounter = {};

    constructor(
        private readonly wsService: WsService,
        private readonly accountService: AccountService,
    ) {
        this.setup();
    }

    public addCommandHandler<K extends keyof WsCommandMap>(
        type: K,
        handler: (client: TrustedClient, message: WsCommandMap[K]) => void,
    ): Subscription {
        if (type === "set-token") {
            throw new Error(`The command ${type} is handled internal`);
        }

        const subscription = this.$commandMessage
            .pipe(filter(x => x.type === type))
            .subscribe(
                ((command) => {
                    handler(command.client, command.message as WsCommandMap[K]);
                })
            );

        this._handlerCounter[type as string] = (this._handlerCounter[type as string] || 0) + 1;
        console.log(`Add handler for ${type}. Increased handlers to ${this._handlerCounter[type as string]}`);

        // When the subscription is removed reduce the counter by one.
        subscription.add(() => {
            // Reduce the counter by one.
            (this._handlerCounter[type as string]) = (this._handlerCounter[type as string]) - 1;
            console.log(`Remove handler for ${type}. Reduced handlers to ${this._handlerCounter[type as string]}`);
        });

        return subscription;
    }

    private setup(): void {
        this.wsService.closedClientEvent.subscribe((clientId) => {
            this.removeClient(clientId, this._newClients, this._trustedClients);
        });

        this.wsService.newClientEvent.subscribe((clientId) => {
            const newClient = <WsMessageClient>{
                clientId: clientId,
            };

            this._newClients.push(newClient);
        });

        this.wsService.message.subscribe(async (ev) => {
            const msgObject = JSON.parse(ev.message) as { command: string, data: object };
            const command = <keyof WsCommandMap>(msgObject.command);
            const commandData = <WsCommandMap[keyof WsCommandMap]>(msgObject.data);
            try {
                await this.handleCommand(ev.clientId, { command: command, data: commandData });
            } catch (err) {
                console.warn(`Command "${command}" was not handled`, err);
            }
        });
    }

    private async handleCommand<K extends keyof WsCommandMap, T extends WsCommandMap[K]>(
        clientId: number,
        commandObject: { command: K, data: T },
    ): Promise<void> {
        // Special case: Handle set token.
        if (commandObject.command === "set-token") {
            const token = (commandObject.data as WsCommandMap["set-token"]).token;
            await this.handleSetToken(clientId, token);

            // Don't perform any processing.
            return Promise.resolve();
        }

        // In all other cases, we check for message handlers.
        const trustedClient = this._trustedClients.find(x => x.clientId === clientId);
        if (!trustedClient) {
            throw new Error(`No trusted client could be found with clientId ${clientId}`);
        }

        if (this._handlerCounter[commandObject.command as string] <= 0) {
            throw new Error(`No trusted client could be found with clientId ${clientId}`);
        }

        this.$commandMessage.next({
            client: trustedClient,
            message: commandObject.data,
            type: commandObject.command
        });

        return Promise.resolve();
    }

    private async handleSetToken(clientId: number, token: string) {
        // Find out to which this token belongs.
        const account = await this.accountService.byToken(token);
        if (!account) {
            // Validation fails, send token rejected and remove from the list.
            this.removeClient(clientId, this._newClients, this._trustedClients);
            this.send(clientId, "token-rejected", new TokenRejectedEvent("No account associated with the given token"));
            this.wsService.close(clientId, 4000, "auto-disconnect due to token rejection (token-invalid)");
        }

        // Ensure the client is *not* in the trusted list
        if (this._trustedClients.find(x => x.clientId === clientId)) {
            this.removeClient(clientId, this._newClients, this._trustedClients);
            this.send(clientId, "token-rejected", new TokenRejectedEvent("Connection is already associated with a token"));
            this.wsService.close(clientId, 4000, "auto-disconnect due to token rejection (already-trusted)");
        }

        const messageClient = this._newClients.find(x => x.clientId === clientId);
        if (!messageClient) {
            // The client is not listed in the new list (this should never happen)
            this.removeClient(clientId, this._newClients, this._trustedClients);
            this.send(clientId, "token-rejected", new TokenRejectedEvent("Connection is not in the new list"));
            this.wsService.close(clientId, 4000, "auto-disconnect due to token rejection (not-in-new)");
        }

        // Everything is OK, move the client to the trusted list.
        const trustedClient: TrustedClient = {
            clientId: messageClient.clientId,
            accountId: account.id
        };

        this.removeClient(clientId, this._newClients);
        this._trustedClients.push(trustedClient);
        this.send(clientId, "token-accepted", { type: "token-accepted" });
    }

    private send<K extends keyof WsEventMap>(clientId, type: K, event: WsEventMap[K]) {
        if (event.type !== type) {
            throw new Error("Type of the event is mismatching");
        }

        this.wsService.send(clientId, JSON.stringify(event));
    }

    private removeClient(clientId: number, ...lists: WsMessageClient[][]) {
        lists.forEach(list => {
            const index = list.findIndex(x => x.clientId === clientId);
            if (index !== -1) {
                list.splice(index, 1);
            }
        });
    }
}
