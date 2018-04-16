import * as express from "express";
import { isAuthenticated } from "../../helpers/is-authenticated";
import { SessionCreate } from "./session-create";
import { SessionDestroy } from "./session-destroy";
import { SessionExtend } from "./session-extend";

const sessionRouter = express.Router();

sessionRouter.post("/create", SessionCreate);
sessionRouter.delete("/destroy", [isAuthenticated, SessionDestroy]);
sessionRouter.patch("/extend", [isAuthenticated, SessionExtend]);

export { sessionRouter };
