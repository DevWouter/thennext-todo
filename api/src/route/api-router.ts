import * as express from "express";

import { isAuthenticated } from "../helpers/is-authenticated";

import { accountRouter } from "./account";
import { sessionRouter } from "./session";
import { taskListRouter } from "./task-list";
import { taskRouter } from "./task";

const apiRouter = express.Router();

apiRouter.use("/account", accountRouter);
apiRouter.use("/session", sessionRouter);
apiRouter.use("/task-list", [isAuthenticated, taskListRouter]);
apiRouter.use("/task", [isAuthenticated, taskRouter]);

export { apiRouter };
