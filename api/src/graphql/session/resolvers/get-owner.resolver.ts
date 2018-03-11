import { GraphContext } from "../../helpers";
import { Session } from "../session.model";
import { Account } from "../../account/account.model";

export async function getOwner(obj: Session, args, context: GraphContext, info): Promise<Account> {
    throw new Error('Not implemented');
}