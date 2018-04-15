import * as express from "express";
import { accountRouter } from "./account";
import { taskListRouter } from "./task-list";

const apiRouter = express.Router();

apiRouter.use("/account", accountRouter);
apiRouter.use("/task-list", taskListRouter);

export { apiRouter };
