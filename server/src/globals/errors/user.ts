import * as Utils from "../../utils";

const userAlreadyExists = Utils.Response.error(
  "Destination already exists",
  409
);

const userNotFound = Utils.Response.error("User not found", 404);

const badRequest = (msg = "All fields are required") =>
  Utils.Response.error(msg, 400);

export { userAlreadyExists, userNotFound, badRequest };