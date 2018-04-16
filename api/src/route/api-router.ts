import * as express from "express";

import { isAuthenticated } from "../helpers/is-authenticated";

import { accountRouter } from "./account";
import { sessionRouter } from "./session";
import { taskListRouter } from "./task-list";

const apiRouter = express.Router();

apiRouter.use("/account", accountRouter);
apiRouter.use("/session", sessionRouter);
apiRouter.use("/task-list", [isAuthenticated, taskListRouter]);

export { apiRouter };
