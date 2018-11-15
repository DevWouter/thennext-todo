import * as express from "express";

import { accountRouter } from "./account";
import { sessionRouter } from "./session";
import { testRouter } from "./test";

const apiRouter = express.Router();

apiRouter.use("/account", accountRouter);
apiRouter.use("/session", sessionRouter);
apiRouter.use("/test", testRouter);


export { apiRouter };
