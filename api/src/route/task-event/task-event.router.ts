import * as express from "express";
// import { SessionCreate } from "./session-create";
// import { SessionDestroy } from "./session-destroy";
// import { SessionExtend } from "./session-extend";

const taskEventRouter = express.Router();

// taskRouter.post("/create", SessionCreate);
// taskRouter.delete("/destroy", [isAuthenticated, SessionDestroy]);
// taskRouter.patch("/extend", [isAuthenticated, SessionExtend]);

export { taskEventRouter };
