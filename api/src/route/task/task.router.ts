import * as express from "express";
import { asyncMiddleware } from "../../helpers/async-helper";

import { TaskIndex } from "./task-index";
import { TaskCreate } from "./task-create";
import { TaskUpdate } from "./task-update";
import { TaskDelete } from "./task-delete";

const taskRouter = express.Router();

taskRouter.get("/index", asyncMiddleware(TaskIndex));
taskRouter.post("/create", asyncMiddleware(TaskCreate));
taskRouter.patch("/:uuid", asyncMiddleware(TaskUpdate));
taskRouter.delete("/:uuid", asyncMiddleware(TaskDelete));

export { taskRouter };
