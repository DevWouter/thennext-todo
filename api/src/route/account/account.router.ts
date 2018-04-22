import * as express from "express";

import { AccountCreate } from "./account-create";
import { isAuthenticated } from "../../helpers/is-authenticated";

const router = express.Router();

router.post("/", AccountCreate); // The post method doesn't require an authentication state.

export { router as accountRouter };
