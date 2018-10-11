import { injectable } from "inversify";
import { Subscription, Subject, Observable } from "rxjs";
import { filter, map } from "rxjs/operators";

import { WsService } from "./ws-service";
import { WsCommandMap } from "./ws/commands";
import { WsEventMap } from "./ws/events";
import { WsMessageClient, TrustedClient } from "./ws/message-client";
import { AccountRepository } from "../repositories/account-repository";
import { SessionRepository } from "../repositories";
import { LoggerService } from "./logger-service";

interface CommandMessage {
    client: TrustedClient;
    type: keyof WsCommandMap;
    message: object;
}

interface SendOptions {
    /**
     * The client to which the message should be send as echo.
     */
    clientId?: number;

    /**
     * The accounts to which the message should be send.
     */
    accounts?: number[];
    refId?: string;
}

@injectable()
export class WsMessageService {
    private readonly _newClients: WsMessageClient[] = [];
    private readonly _trustedClients: TrustedClient[] = [];

    private readonly $commandMessage = new Subject<CommandMessage>();

    constructor(
        private readonly wsService: WsService,
        private readonly accountRepository: AccountRepository,
        private readonly sessionRepository: SessionRepository,
        private readonly logger: LoggerService,
    ) {
        this.setup();
    }

    public commandsOf<K extends keyof WsCommandMap>(
        type: K,
    ): Observable<{ client: TrustedClient, event: WsCommandMap[K] }> {
        if (type === "set-token") {
            throw new Error(`The command ${type} is handled internal`);
        }

        return this.$commandMessage
            .pipe(
                filter(x => x.type === type),
                map(x => ({ client: x.client, event: x.message as WsCommandMap[K] }))
            );
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
            try {
                const msgObject = JSON.parse(ev.message) as { command: string, data: object };
                const command = <keyof WsCommandMap>(msgObject.command);
                const commandData = <WsCommandMap[keyof WsCommandMap]>(msgObject.data);
                try {
                    await this.handleCommand(ev.clientId, { command: command, data: commandData });
                } catch (err) {
                    this.logger.warn(`Command "${command}" was not handled`, err);
                }
            } catch (err) {
                this.logger.error(err);
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
            this.wsService.close(clientId, 4000, "Send set-token command before any other commands");
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
        const account = await this.accountRepository.byToken(token);
        if (!account) {
            // Validation fails, send token rejected and remove from the list.
            this.send("token-rejected", { reason: "No account associated with the given token" }, { clientId: clientId });
            this.removeClient(clientId, this._newClients, this._trustedClients);
            this.wsService.close(clientId, 4000, "auto-disconnect due to token rejection (token-invalid)");
            return;
        }

        // Ensure the client is *not* in the trusted list
        if (this._trustedClients.find(x => x.clientId === clientId)) {
            this.send("token-rejected", { reason: "Connection is already associated with a token" }, { clientId: clientId });
            this.removeClient(clientId, this._newClients, this._trustedClients);
            this.wsService.close(clientId, 4000, "auto-disconnect due to token rejection (already-trusted)");
            return;
        }

        const messageClient = this._newClients.find(x => x.clientId === clientId);
        if (!messageClient) {
            // The client is not listed in the new list (this should never happen)
            this.send("token-rejected", { reason: "Connection is not in the new list" }, { clientId: clientId });
            this.removeClient(clientId, this._newClients, this._trustedClients);
            this.wsService.close(clientId, 4000, "auto-disconnect due to token rejection (not-in-new)");
            return;
        }

        // Everything is OK, move the client to the trusted list.
        const trustedClient: TrustedClient = {
            clientId: messageClient.clientId,
            accountId: account.id
        };

        // Extend the use of the token.
        await this.sessionRepository.extend(token);

        this.removeClient(clientId, this._newClients);
        this._trustedClients.push(trustedClient);
        this.send("token-accepted", {}, { clientId: clientId });
    }

    public send<K extends keyof WsEventMap>(type: K, event: WsEventMap[K], options: SendOptions) {
        const processedClients: WsMessageClient[] = [];
        const sendCommand = (client: WsMessageClient, content: WsEventMap[K]) => {
            // Only perform th check once.
            if (processedClients.includes(client)) {
                return;
            }

            processedClients.push(client);
            const msgString = JSON.stringify({
                type: type,
                echo: client.clientId === options.clientId,
                refId: options.refId,
                data: content,
            });

            try {
                this.wsService.send(client.clientId, msgString);
            } catch (err) {
                this.logger.error(`Unable to send a ${type} event to client ${client.clientId}`, err);
            }
        };

        // Go over all clients
        this._newClients.forEach(client => {
            if (client.clientId === options.clientId) {
                sendCommand(client, event);
            }
        });

        this._trustedClients.forEach(client => {
            if (client.clientId === options.clientId) {
                sendCommand(client, event);
            }

            if (options.accounts && options.accounts.includes(client.accountId)) {
                sendCommand(client, event);
            }
        });
    }

    private removeClient(clientId: number, ...lists: WsMessageClient[][]) {
        let removeCounter = 0;
        lists.forEach(list => {
            const index = list.findIndex(x => x.clientId === clientId);
            if (index !== -1) {
                removeCounter++;
                list.splice(index, 1);
            }
        });

        if (removeCounter === 0) {
            this.logger.warn(`The client ${clientId} was not registered in any of the lists`);
        }
    }
}
