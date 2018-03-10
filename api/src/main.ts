import * as express from 'express';
import * as bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import { NextResolverFn } from 'graphql-tools/dist/Interfaces';
import { GraphQLOptions } from 'apollo-server-core';



const schema = makeExecutableSchema({
    typeDefs: `type Query { hello: String }`,
    resolvers: {
        Query: { hello: () => 'hello world' }
    },
    allowUndefinedInResolve: false,
});



const optionsFunc = (req?: express.Request, res?: express.Response): GraphQLOptions | Promise<GraphQLOptions> => {
    return {
        schema, // Yes, we can switch schema based on the authorization.
    };
}

const app = express();
app.use('/graphql', bodyParser.json(), graphqlExpress(optionsFunc));
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
app.use('/', (req, res) => res.send('Hello world'));

app.listen(3000, () => {
    console.log(`Server is listening on http://localhost:3000`);
});