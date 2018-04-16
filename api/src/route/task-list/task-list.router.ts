import * as express from "express";

import { TaskListList } from "./task-list-list";
import { taskListCreate } from "./task-list-create";

const taskListRouter = express.Router();

taskListRouter.get("/", TaskListList);
taskListRouter.post("/", taskListCreate);


export { taskListRouter };
