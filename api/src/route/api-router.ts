import * as express from "express";

import { isAuthenticated } from "../helpers/is-authenticated";

import { accountRouter } from "./account";
import { checklistItemRouter } from "./checklist-item";
import { sessionRouter } from "./session";
import { taskListRouter } from "./task-list";
import { taskRouter } from "./task";
import { scoreShiftRouter } from "./score-shift/score-shift.router";

const apiRouter = express.Router();

apiRouter.use("/account", accountRouter);
apiRouter.use("/checklist-item", [isAuthenticated, checklistItemRouter]);
apiRouter.use("/session", sessionRouter);
apiRouter.use("/task-list", [isAuthenticated, taskListRouter]);
apiRouter.use("/task", [isAuthenticated, taskRouter]);
apiRouter.use("/score-shift", [isAuthenticated, scoreShiftRouter]);

export { apiRouter };
