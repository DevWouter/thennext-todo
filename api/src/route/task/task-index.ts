import { Request, Response } from "express";
import { getConnection } from "typeorm";

import { AccountEntity } from "../../db/entities";
import { getAuthorizationToken } from "../../server/get-authorization-token";
import { getAccount } from "../../server/get-account";
import { Task } from "./task.model";


export async function TaskIndex(req: Request, res: Response): Promise<void> {
    const token = getAuthorizationToken(req);
    const account = await getAccount(token);

    const src = await getConnection()
        .createQueryBuilder(AccountEntity, "account")
        .leftJoinAndSelect("account.taskLists", "taskList")
        .innerJoinAndSelect("taskList.owner", "owner")
        .leftJoinAndSelect("taskList.tasks", "task")
        .where("account.id = :id", { id: account.id })
        .getOne();

    const dst: Task[] = [];

    src.taskLists.forEach(list => {
        list.tasks.forEach(task => {
            dst.push(<Task>{
                uuid: task.uuid,
                taskListUuid: list.uuid,
                title: task.title,
                description: task.description,
                status: task.status,
                createdOn: task.createdAt,
                updatedOn: task.updatedAt,
                completedOn: task.completedAt,
            });
        });
    });

    res.send(dst);
}
