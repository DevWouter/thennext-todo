import * as express from "express";
import { TaskRelationDestroy as destroy } from "./task-relation-delete";
import { TaskRelationCreate as create } from "./task-relation-create";
import { TaskRelationIndex as index } from "./task-relation-index";
import { asyncMiddleware } from "../../helpers/async-helper";

const router = express.Router();

router.get("/index", asyncMiddleware(index));
router.post("/create", asyncMiddleware(create));
router.delete("/:uuid", asyncMiddleware(destroy));


export { router as taskRelationRouter };
