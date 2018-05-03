import { AccountEntity } from "../../db/entities";

export interface Account {
    uuid: string;
    email: string;
}

export function TransformAccount(src: AccountEntity): Account {
    return <Account>{
        uuid: src.uuid,
        email: src.email,
    };
}
