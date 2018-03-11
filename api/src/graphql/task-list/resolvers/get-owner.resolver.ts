import { GraphContext } from "../../helpers";
import { Account } from "../../account/account.model";
import { TaskList } from "../task-list.model";

export async function getOwner(obj: TaskList, args, context: GraphContext, info): Promise<Account> {
    throw new Error('Not implemented');
}