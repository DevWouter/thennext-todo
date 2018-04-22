import { Request, Response } from "express";
import { getConnection } from "typeorm";

import { TaskList } from "./task-list.model";
import { TaskListEntity } from "../../db/entities";


import container from "../../inversify.config";
import { AuthenticationService } from "../../services/authentication-service";
import { AccountService } from "../../services/account-service";

export interface TaskListInput {
    readonly name: string;
}

export async function TaskListDelete(req: Request, res: Response): Promise<void> {
    const entityManager = getConnection().createEntityManager();

    const authService = container.resolve(AuthenticationService);
    const accountService = container.resolve(AccountService);

    const token = authService.getAuthenticationToken(req);
    const account = await accountService.byToken(token);

    const taskList = await entityManager.findOne(TaskListEntity, {
        where: {
            uuid: req.params.uuid,
            primary: false // Never allow a primary to be deleted.
        },
        join: {
            alias: "taskList",
            leftJoinAndSelect: {
                owner: "taskList.owner"
            }
        }
    });

    if (!taskList) {
        throw new Error(`No non-primary tasklist found with id '${req.params.uuid}'`);
    }

    if (taskList.primary) {
        throw new Error(`taskList '${taskList.uuid} cannot be deleted as it is a primary tasklist of the user`);
    }

    if (taskList.owner.uuid !== account.uuid) {
        throw new Error(`taskList '${taskList.uuid}' is NOT owned by user ${account.uuid}`);
    }

    await entityManager.delete(TaskListEntity, taskList);

    res.send({});
}
