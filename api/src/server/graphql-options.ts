import * as express from "express";
import { GraphQLOptions } from "apollo-server-core";
import { createConnection, getManager, Connection } from "typeorm";
import { GraphContext } from "../graphql/helpers";
import { schema } from "./graphql-schema";

function getAuthorizationToken(req?: express.Request) {
    const authorization_header = req.header("Authorization");
    if (authorization_header) {
        const regex_result = /Bearer (.*)/.exec(authorization_header);
        if (regex_result) {
            const token = regex_result[1];
            return token;
        }
    }

    // No token found in authorization.
    return null;
}

export async function GraphqlRequestHandler(
    connectionPromise: Promise<Connection>,
    req?: express.Request,
    res?: express.Response,
): Promise<GraphQLOptions> {
    // Wait until connection can be resolved, once resolved it will be instant.
    const connection = await connectionPromise;
    const entityManager = getManager();

    const context = <GraphContext>{
        entityManager: entityManager,
        authorizationToken: getAuthorizationToken(req)
    };

    return {
        schema,
        context
    };
}
