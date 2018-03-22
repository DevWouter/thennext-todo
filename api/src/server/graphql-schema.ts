import { makeExecutableSchema } from "graphql-tools";

import {
    directiveResolvers,
    resolvers,
    typeDefs,
} from "../graphql";

export const schema = makeExecutableSchema({
    typeDefs: typeDefs,
    resolvers: resolvers,
    allowUndefinedInResolve: false,
    directiveResolvers: directiveResolvers,
    // resolverValidationOptions: {
    //     requireResolversForNonScalar: true,
    //     allowResolversNotInSchema: false
    // }
});
