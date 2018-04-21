import { injectable } from "inversify";
import { Request } from "express";

@injectable()
export class AuthenticationService {
    constructor() { }

    getAuthenticationToken(req: Request) {
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
}
