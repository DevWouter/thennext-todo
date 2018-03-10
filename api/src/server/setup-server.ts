import 'reflect-metadata'; // Required so that typeorm can read the types.
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import { GraphQLOptions } from 'apollo-server-core';

import { createConnection, getManager, Connection } from 'typeorm';
import { GraphContext, typeDefs } from '../graphql/helpers';
import { resolvers } from '../graphql';


const schema = makeExecutableSchema({
    typeDefs: typeDefs,
    resolvers: resolvers,
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

export function startServer(connection: Connection, port: number) {
    const app = express();
    app.use('/graphql', bodyParser.json(), graphqlExpress(optionsFunc));
    app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

    app.listen(port, () => {
        console.log(`Server is listening on ${port}`);
    });
}
