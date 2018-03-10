import { EntityManager } from "typeorm";

export interface Account {
    uuid: string;
    email: string;
}


export interface CreateAccountInput {
    email: string;
    password: string;
}

export interface AccountSettings {
    scrollToNewTasks: boolean;
    hideScoreInTaskList: boolean;

    defaultWaitUntil: string;

    urgencyPerDay: number;
    urgencyWhenActive: number;
    urgencyWhenDescription: number;
    urgencyWhenBlocking: number;
    urgencyWhenBlocked: number;
}

export interface GraphContext { 
    entityManager: EntityManager;
}