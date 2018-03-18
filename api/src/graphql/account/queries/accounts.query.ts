import { GraphContext } from "../../helpers";
import { Account } from "../account.model";

export async function accounts(obj: Account, args, context: GraphContext, info): Promise<Account[]> {
    throw new Error("Not implemented");
}
