import * as express from "express";
import { asyncMiddleware } from "../../helpers/async-helper";

import { ScoreShiftCreate } from "./score-shift-create";
import { ScoreShiftDelete } from "./score-shift-delete";
import { ScoreShiftIndex } from "./score-shift-index";
import { ScoreShiftUpdate } from "./score-shift-update";

const router = express.Router();

router.get("/index", asyncMiddleware(ScoreShiftIndex));
router.post("/create", asyncMiddleware(ScoreShiftCreate));
router.patch("/:uuid", asyncMiddleware(ScoreShiftUpdate));
router.delete("/:uuid", asyncMiddleware(ScoreShiftDelete));

export { router as scoreShiftRouter};
