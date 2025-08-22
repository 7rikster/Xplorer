import * as Utils from "../../utils/index.js";

const moodDestinationAlreadyExists = Utils.Response.error(
  "Mood destination already exists",
  409
);

const moodDestinationNotFound = Utils.Response.error("Mood destination not found", 404);

const badRequest = (msg = "All fields are required") =>
  Utils.Response.error(msg, 400);

export { moodDestinationAlreadyExists, moodDestinationNotFound, badRequest };
