import { AccountEntity } from "../../../db/entities";
import { Account } from "../../../models";

export function TransformAccount(src: AccountEntity): Account {
    return {
        uuid: src.uuid,
        email: src.email,
    };
}
