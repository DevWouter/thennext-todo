import { GraphContext } from "../../helpers";
import { Account } from "../account.model";

export async function account(obj: Account, args: {uuid: string }, context: GraphContext, info): Promise<Account> {
    throw new Error('Not implemented');
}