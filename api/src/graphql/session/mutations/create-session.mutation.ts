import { GraphContext } from "../../helpers";
import { Session } from "../session.model";

export function createSession(obj, args: { email: string, password: string }, context: GraphContext, info): Promise<Session> {
    throw new Error('Not implemented');
}