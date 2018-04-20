import * as express from "express";
import { asyncMiddleware } from "../../helpers/async-helper";

import { TaskIndex } from "./task-index";
import { TaskCreate } from "./task-create";
import { TaskUpdate } from "./task-update";
import { TaskDelete } from "./task-delete";

const router = express.Router();

router.get("/index", asyncMiddleware(TaskIndex));
router.post("/create", asyncMiddleware(TaskCreate));
router.patch("/:uuid", asyncMiddleware(TaskUpdate));
router.delete("/:uuid", asyncMiddleware(TaskDelete));

export { router as taskRouter };
