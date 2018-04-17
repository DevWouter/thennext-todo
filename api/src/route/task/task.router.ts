import * as express from "express";

import { TaskIndex } from "./task-index";

const taskRouter = express.Router();

taskRouter.get("/index", TaskIndex);

export { taskRouter };
