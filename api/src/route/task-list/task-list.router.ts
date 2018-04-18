import * as express from "express";

import { TaskListList } from "./task-list-list";
import { taskListCreate } from "./task-list-create";
import { TaskListDelete } from "./task-list-delete";
import { asyncMiddleware } from "../../helpers/async-helper";

const taskListRouter = express.Router();

taskListRouter.get("/index", asyncMiddleware(TaskListList));
taskListRouter.post("/create", taskListCreate);
taskListRouter.post("/create", taskListCreate);
taskListRouter.delete("/:uuid", TaskListDelete);

export { taskListRouter };
