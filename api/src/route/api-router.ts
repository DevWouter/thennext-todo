import * as express from "express";

import { isAuthenticated } from "../helpers/is-authenticated";

import { accountRouter } from "./account";
import { checklistItemRouter } from "./checklist-item";
import { scoreShiftRouter } from "./score-shift/score-shift.router";
import { sessionRouter } from "./session";
import { taskListRightRouter } from "./task-list-right/task-list-right.router";
import { taskListRouter } from "./task-list";
import { taskListShareRouter } from "./task-list-share";
import { taskRelationRouter } from "./task-relation";
import { taskRouter } from "./task";
import { taskTimeLapRouter } from "./task-time-lap";
import { urgencyLapRouter } from "./urgency-lap/task-time-lap.router";

const apiRouter = express.Router();

apiRouter.use("/account", accountRouter);
apiRouter.use("/checklist-item", [isAuthenticated, checklistItemRouter]);
apiRouter.use("/score-shift", [isAuthenticated, scoreShiftRouter]);
apiRouter.use("/session", sessionRouter);
apiRouter.use("/task-list-right", [isAuthenticated, taskListRightRouter]);
apiRouter.use("/task-list-share", [isAuthenticated, taskListShareRouter]);
apiRouter.use("/task-list", [isAuthenticated, taskListRouter]);
apiRouter.use("/task-relation", [isAuthenticated, taskRelationRouter]);
apiRouter.use("/task-time-lap", [isAuthenticated, taskTimeLapRouter]);
apiRouter.use("/task", [isAuthenticated, taskRouter]);
apiRouter.use("/urgency-lap", [isAuthenticated, urgencyLapRouter]);

export { apiRouter };
