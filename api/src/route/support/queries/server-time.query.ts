import { GraphContext } from "../../helpers";

export async function serverTime(obj, args: { }, context: GraphContext, info): Promise<Date> {
    return new Date();
}
