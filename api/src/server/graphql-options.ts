import * as express from "express";
import { GraphQLOptions } from "apollo-server-core";
import { createConnection, getManager, Connection } from "typeorm";
import { GraphContext } from "../graphql/helpers";
import { schema } from "./graphql-schema";
import { AccountEntity, SessionEntity } from "../db/entities";

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
    const token = getAuthorizationToken(req);

    const context = <GraphContext>{
        entityManager: entityManager,
        authorizationToken: token,
        db: connection,
        getAccount: (): Promise<AccountEntity> => {
            return new Promise<AccountEntity>((resolve, reject) => {
                return connection
                    .createQueryBuilder(AccountEntity, "account")
                    .innerJoin("account.sessions", "session", "session.token = :token", { token })
                    .getOne()
                    .then(resolve)
                    .catch(reject);
            });
        }
    };

    return {
        schema,
        context
    };
}
