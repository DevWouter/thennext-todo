import * as express from "express";

import { AccountCreate } from "./account-create";
import { AccountList } from "./account-list";
import { AccountMe } from "./account-me";
import { isAuthenticated } from "../../helpers/is-authenticated";

const accountRouter = express.Router();

accountRouter.get("/", [isAuthenticated, AccountList]);
accountRouter.get("/me", [isAuthenticated, AccountMe]);

// The post method doesn't require an authentication state.
accountRouter.post("/", AccountCreate);

export { accountRouter };
