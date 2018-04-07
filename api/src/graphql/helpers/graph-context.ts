import { EntityManager, Connection } from "typeorm";

export interface GraphContext {
    readonly entityManager: EntityManager;
    readonly authorizationToken: string;
    readonly db: Connection;
}
