import * as Utils from "../../utils/index.js";

const hoardingAlreadyExists = Utils.Response.error(
  "Hoarding already exists",
  409
);

const hoardingNotFound = Utils.Response.error("Hoarding not found", 404);

const badRequest = (msg = "All fields are required") =>
  Utils.Response.error(msg, 400);

export { hoardingAlreadyExists, hoardingNotFound, badRequest };
