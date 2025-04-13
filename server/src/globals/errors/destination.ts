import * as Utils from "../../utils";

const destinationAlreadyExists = Utils.Response.error(
  "Destination already exists",
  409
);

const destinationNotFound = Utils.Response.error("Destination not found", 404);

const badRequest = (msg = "All fields are required") =>
  Utils.Response.error(msg, 400);

export { destinationAlreadyExists, destinationNotFound, badRequest };
