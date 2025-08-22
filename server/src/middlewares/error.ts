import { ErrorRequestHandler } from "express";

import * as Interfaces from "../interfaces/index.js";
import * as Errors from "../globals/errors/index.js";

const errorHandler: ErrorRequestHandler = async (
  err: Error | Interfaces.JSON.Response,
  _req,
  res,
  next
) => {
  if (!err) {
    return next();
  }

  if (err instanceof Error) {
    console.log(`Error | Code: ${500}, Message: ${err.message}`);
    return res.status(500).json(Errors.System.serverError);
  } else if (err) {
    console.log(`Error -> Code: ${err.status || 500}, Message: ${err}`);
    return res.status(err.status || 500).json(err);
  } else {
    return next();
  }
};

export { errorHandler };
