import { GraphContext } from "../helpers";

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
    throw new Error("The authentication is not implemented");
}
