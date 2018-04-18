import { Request, Response } from "express";
import { getConnection } from "typeorm";

import { TaskList } from "./task-list.model";
import { TaskListEntity } from "../../db/entities";

import { getAccount } from "../../server/get-account";
import { getAuthorizationToken } from "../../server/get-authorization-token";

export interface TaskListInput {
    readonly name: string;
}

export async function TaskListDelete(req: Request, res: Response): Promise<void> {
    const entityManager = getConnection().createEntityManager();
    const token = getAuthorizationToken(req);
    const account = await getAccount(token);

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
