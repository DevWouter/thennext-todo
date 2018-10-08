/**
 * Each token can only be consumed once. Once consumed it will be deleted from the database.
 * A token can only be consumed if the data presented by validUntil has not yet passed.
 */
export interface PasswordRecoveryTokenEntity {
    id: number;
    accountId: number;
    token: string;
    createdAt: Date; // The date at which the token was created.
    validUntil: Date; // The date until which it is valid.
}