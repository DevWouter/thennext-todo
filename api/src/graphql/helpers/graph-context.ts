import { EntityManager } from "typeorm";

export interface GraphContext {
    entityManager: EntityManager;
}
