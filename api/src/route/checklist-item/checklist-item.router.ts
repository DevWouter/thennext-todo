import * as express from "express";
import { asyncMiddleware } from "../../helpers/async-helper";

import { ChecklistItemCreate } from "./checklist-item-create";
import { ChecklistItemDelete } from "./checklist-item-delete";
import { ChecklistItemUpdate } from "./checklist-item-update";
import { ChecklistItemIndex } from "./checklist-item-index";

const router = express.Router();

router.get("/index", asyncMiddleware(ChecklistItemIndex));
router.post("/create", asyncMiddleware(ChecklistItemCreate));
router.patch("/:uuid", asyncMiddleware(ChecklistItemUpdate));
router.delete("/:uuid", asyncMiddleware(ChecklistItemDelete));

export { router as checklistItemRouter };
