import * as Utils from "../../utils/index.js";

const reviewAlreadyExists = Utils.Response.error(
  "Review already exists",
  409
);

const reviewNotFound = Utils.Response.error("Review not found", 404);

const badRequest = (msg = "All fields are required") =>
  Utils.Response.error(msg, 400);

export { reviewAlreadyExists, reviewNotFound, badRequest };
