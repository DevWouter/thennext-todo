export interface Session {
    _id: number;
    ownerUuid: string;
    token: string;
    expireAt: Date;
}
