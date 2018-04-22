import { Request, Response } from "express";
import { getConnection, Connection } from "typeorm";



import { ChecklistItem } from "./checklist-item.model";
import { TaskEntity, ChecklistItemEntity, AccountEntity } from "../../db/entities";
import { AuthenticationService } from "../../services/authentication-service";
import container from "../../inversify.config";
import { AccountService } from "../../services/account-service";

export async function ChecklistItemIndex(req: Request, res: Response): Promise<void> {
    const authService = container.resolve(AuthenticationService);
    const accountService = container.resolve(AccountService);
    const token = authService.getAuthenticationToken(req);
    const account = await accountService.byToken(token);
    const db = await getConnection();
    const entityManager = db.createEntityManager();

    const query = db
        .createQueryBuilder(AccountEntity, "account")
        .leftJoinAndSelect("account.taskLists", "taskList")
        .leftJoinAndSelect("taskList.owner", "owner")
        .leftJoinAndSelect("taskList.tasks", "task")
        .leftJoinAndSelect("task.checklistItems", "checklistItem")
        .where("account.id = :id", { id: account.id });

    const src = await query.getOne();

    const apiData = src.taskLists.map(tasklist => tasklist.tasks.map(task => {
        return task.checklistItems.map(item => <ChecklistItem>{
            taskUuid: task.uuid,
            uuid: item.uuid,
            title: item.title,
            checked: item.checked,
        });
    }));

    const flatApiData = apiData.reduce((pv, cv) => [...cv, ...pv], [])
        .reduce((pv, cv) => [...cv, ...pv], []);
    res.send(flatApiData);
}
