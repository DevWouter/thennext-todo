export interface AccountEntity {
    id: number;
    uuid: string;
    email: string;
    displayName: string;
    password_hash: string;
    is_confirmed: boolean;
}
