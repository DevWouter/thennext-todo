import * as express from "express";

import { accountRouter } from "./account";
import { sessionRouter } from "./session";

const apiRouter = express.Router();

apiRouter.use("/account", accountRouter);
apiRouter.use("/session", sessionRouter);


export { apiRouter };
