import { GraphContext } from "../../helpers";
import { Account } from "../account.model";

export async function me(obj, args, context: GraphContext, info): Promise<Account> {
    throw new Error("Not implemented");
}
