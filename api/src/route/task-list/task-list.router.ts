import * as express from "express";
import container from "../../inversify.config";
import { asyncMiddleware } from "../../helpers/async-helper";
import { TaskListController } from "./task-list.controller";

const controller = container.resolve(TaskListController);

const taskListRouter = express.Router();

taskListRouter.get("/index", asyncMiddleware(controller.index.bind(controller)));
taskListRouter.post("/create", asyncMiddleware(controller.create.bind(controller)));
taskListRouter.delete("/:uuid", asyncMiddleware(controller.delete.bind(controller)));

export { taskListRouter };
