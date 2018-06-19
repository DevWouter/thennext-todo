import { Request, Response } from "express";
import { isError } from "util";

export const asyncMiddleware = fn =>
  (req: Request, res: Response, next) => {
    Promise.resolve(fn(req, res, next))
      .catch((reason) => {
        if (isError(reason)) {
          const error = reason as Error;
          res.status(500).send({ error: error.message });
        } else {
          res.status(500).send({ error: "An internal error has occurred that was not thrown correctly" });
        }
        console.error(reason);
        return next();
      });
  };
