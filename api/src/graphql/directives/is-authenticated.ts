import * as moment from "moment";

import { GraphContext } from "../helpers";
import { SessionEntity } from "../../db/entities";
/**
 * @param next The function that is called to continue resolving the graph.
 * @param source The object (if any) which is the owner/parent of what needs to be resolved
 * @param args The arguments in the graph *definition* (in this case the allowed role)
 * @param context The context object (which can contain tokens, services, database, et cetera)
 * @param info An object information of the graph and the current resolving action
 */
export async function isAuthenticated(
    next: () => Promise<any>,
    source,
    args: {},
    context: GraphContext,
    info
) {
    if (context.authorizationToken) {
        // Validate the token
        const session = await context.entityManager.findOne(SessionEntity, { where: { token: context.authorizationToken } });
        if (!session) {
            console.warn(`No session found with token: ${context.authorizationToken}`);
            throw new Error(`Token invalid`);
        }

        if (moment(session.expire_on).isBefore(moment())) {
            console.log(`AUTH token expired: ${context.authorizationToken}`);
            context.entityManager.remove(session);
            throw new Error(`Token expired`);
        }

        // Call the next resolver.
        console.log(`AUTH token valid: ${context.authorizationToken}`);
        return next();
    }

    throw new Error(`Token required`);
}
