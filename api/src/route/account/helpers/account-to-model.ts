import { AccountEntity } from "../../../db/entities";
import { Account } from "../account.model";

export function TransformAccount(src: AccountEntity): Account {
    return <Account>{
        uuid: src.uuid,
        email: src.email,
    };
}
