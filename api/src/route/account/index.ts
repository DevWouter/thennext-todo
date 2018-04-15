import * as express from "express";

import { AccountCreate } from "./account-create";
import { AccountList } from "./account-list";
import { AccountMe } from "./account-me";

const accountRouter = express.Router();

accountRouter.get("/", AccountList);
accountRouter.get("/me", AccountMe);

accountRouter.post("/", AccountCreate);

export { accountRouter };
