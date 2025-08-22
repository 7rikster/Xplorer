import * as Utils from "../../utils/index.js";

const tripAlreadyExists = Utils.Response.error(
  "Trip already exists",
  409
);

const tripNotFound = Utils.Response.error("Trip not found", 404);

const badRequest = (msg = "All fields are required") =>
  Utils.Response.error(msg, 400);

export { tripAlreadyExists, tripNotFound, badRequest };
