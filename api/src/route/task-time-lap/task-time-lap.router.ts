import * as express from "express";
import { asyncMiddleware } from "../../helpers/async-helper";

import { TaskTimeLapCreate } from "./task-time-lap-create";
import { TaskTimeLapDelete } from "./task-time-lap-delete";
import { TaskTimeLapUpdate } from "./task-time-lap-update";
import { TaskTimeLapIndex } from "./task-time-lap-index";

const router = express.Router();

router.get("/index", asyncMiddleware(TaskTimeLapIndex));
router.post("/create", asyncMiddleware(TaskTimeLapCreate));
router.patch("/:uuid", asyncMiddleware(TaskTimeLapUpdate));
router.delete("/:uuid", asyncMiddleware(TaskTimeLapDelete));

export { router as taskTimeLapRouter };
