import * as express from "express";
import container from "../../inversify.config";
import { asyncMiddleware } from "../../helpers/async-helper";
import { TestController } from "./test.controller";

const controller = container.resolve(TestController);
const router = express.Router();

router.post("/seed", asyncMiddleware(controller.seed.bind(controller)));

export { router as testRouter };
