import { EntityManager } from "typeorm";

export interface GraphContext {
    readonly entityManager: EntityManager;
    readonly authorizationToken: string;
}
