import * as express from "express";

import { TaskIndex } from "./task-index";
import { TaskCreate } from "./task-create";
import { asyncMiddleware } from "../../helpers/async-helper";

const taskRouter = express.Router();

taskRouter.get("/index", asyncMiddleware(TaskIndex));
taskRouter.post("/create", asyncMiddleware(TaskCreate));

export { taskRouter };
