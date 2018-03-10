
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import { GraphQLOptions } from 'apollo-server-core';

import { getTypes as getGraphQLTypeDefs } from './graphql';

const schema = makeExecutableSchema({
    typeDefs: getGraphQLTypeDefs(),
    resolvers: {
        Query: {}
    },
    allowUndefinedInResolve: false,
});

const optionsFunc = (req?: express.Request, res?: express.Response): GraphQLOptions | Promise<GraphQLOptions> => {
    const context = {};
    return {
        schema,
        context
    };
}

const app = express();
app.use('/graphql', bodyParser.json(), graphqlExpress(optionsFunc));
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

app.listen(3000, () => {
    console.log(`Server is listening on 3000`);
});