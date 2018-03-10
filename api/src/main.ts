import 'reflect-metadata'; // Required so that typeorm can read the types.
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import { GraphQLOptions } from 'apollo-server-core';

import { getTypes as getGraphQLTypeDefs } from './graphql';
import { createConnection, getManager } from 'typeorm';
import { GraphContext } from './graphql/models/shame';
import { createAccount, account_Settings } from './graphql/account.resolver';

const schema = makeExecutableSchema({
    typeDefs: getGraphQLTypeDefs(),
    resolvers: {
        Query: {},
        Mutation: {
            createAccount: createAccount,
        },
        Account: {
            settings: account_Settings,
        }
    },
    allowUndefinedInResolve: false,
});

async function optionsFunc(req?: express.Request, res?: express.Response): Promise<GraphQLOptions> {
    const manager = await getManager();
    const context = <GraphContext>{
        entityManager: manager
    };
    return {
        schema,
        context
    };
}

// Create a connection to the database.
createConnection().then(connection => {
    const app = express();
    app.use('/graphql', bodyParser.json(), graphqlExpress(optionsFunc));
    app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

    app.listen(3000, () => {
        console.log(`Server is listening on 3000`);
    });
})