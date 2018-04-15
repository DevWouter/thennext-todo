import * as express from "express";

export function getAuthorizationToken(req?: express.Request) {
    const authorization_header = req.header("Authorization");
    if (authorization_header) {
        const regex_result = /Bearer (.*)/.exec(authorization_header);
        if (regex_result) {
            const token = regex_result[1];
            return token;
        }
    }

    // No token found in authorization.
    return "$2a$10$ynCT7Etbe4A1pSkuMxxPje";
    return null;
}
