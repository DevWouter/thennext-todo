export interface SessionEntity {
    id: number;
    accountId: number;
    token: string;
    created_on: Date;
    expire_on: Date;
}
