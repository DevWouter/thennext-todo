import { AccountEntity } from "../db/entities";
import { getConnection } from "typeorm";

export async function getAccount(token: string): Promise<AccountEntity> {
    return getConnection()
        .createQueryBuilder(AccountEntity, "account")
        .innerJoin("account.sessions", "session", "session.token = :token", { token })
        .getOne();
}
