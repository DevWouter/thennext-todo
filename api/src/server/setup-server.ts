import "reflect-metadata"; // Required so that typeorm can read the types.
import * as express from "express";
import * as bodyParser from "body-parser";
import { graphqlExpress, graphiqlExpress } from "apollo-server-express";
import { createConnection } from "typeorm";

import { GraphqlRequestHandler } from "./graphql-options";


export function startServer(port: number) {
    console.log("Server is starting");
    const connectionPromise = createConnection();

    const app = express();
    app.use("/graphql", bodyParser.json(), graphqlExpress((req, res) => GraphqlRequestHandler(connectionPromise, req, res)));
    app.use("/graphiql", graphiqlExpress({ endpointURL: "/graphql" }));

    app.listen(port, () => {
        console.log("Server is ready");
    });
}
