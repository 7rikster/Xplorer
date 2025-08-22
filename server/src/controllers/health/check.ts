import * as Interfaces from "../../interfaces/index.js";
import * as Errors from "../../globals/errors/index.js";
import * as Success from "../../globals/success/index.js";

const check: Interfaces.Controllers.Async = async (_req, res) => {
  return res.json(Success.Health.api);
};

const ping: Interfaces.Controllers.Async = async (req, res, next) => {
  const { msg } = (req?.body as Interfaces.Health.CheckBody) ?? {};

  if (!msg) {
    return res.json(Success.Health.api);
  }

  // Runtime check
  if (typeof msg !== "string") {
    return next(Errors.System.typeError);
  }

  return res.json(Success.Health.pong);
};

export { check, ping };
