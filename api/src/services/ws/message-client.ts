export interface WsMessageClient {
    readonly clientId: number;
}

export interface TrustedClient extends WsMessageClient {
    readonly accountId: number;
}
