import { EntityManager, Connection } from "typeorm";
import { AccountEntity } from "../../db/entities";

export interface GraphContext {
    readonly entityManager: EntityManager;
    readonly authorizationToken: string;
    readonly db: Connection;
    getAccount(): Promise<AccountEntity>;
}
