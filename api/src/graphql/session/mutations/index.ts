import { createSession } from "./create-session.mutation";
import { extendSession } from "./extend-session.mutation";
import { destroySession } from "./destroy-session.mutation";

export const SessionMutations = {
    createSession,
    extendSession,
    destroySession,
};
