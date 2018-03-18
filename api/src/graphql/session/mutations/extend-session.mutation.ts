import { GraphContext } from "../../helpers";
import { Session } from "../session.model";

export async function extendSession(obj, args: { token: string }, context: GraphContext, info): Promise<Session> {
    throw new Error("Not implemented");
}
