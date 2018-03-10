import { createSession } from "./create-session.mutation";
import { extendSession } from "./extend-session.mutation";
import { destroySession } from "./destroy-session.mutation";

export const SessionMutation = {
    createSession,
    extendSession,
    destroySession,
}
