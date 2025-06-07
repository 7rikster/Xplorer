import * as Utils from "../../utils";

const faqAlreadyExists = Utils.Response.error(
  "Faq already exists",
  409
);

const faqNotFound = Utils.Response.error("Faq not found", 404);

const badRequest = (msg = "All fields are required") =>
  Utils.Response.error(msg, 400);

export { faqAlreadyExists, faqNotFound, badRequest };
