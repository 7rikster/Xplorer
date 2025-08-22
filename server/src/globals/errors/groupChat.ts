import * as Utils from "../../utils/index.js";

const groupChatAlreadyExists = Utils.Response.error(
  "Group chat already exists",
  409
);

const adminNotFound = Utils.Response.error("Admin not found", 404);

const groupChatNotFound = Utils.Response.error("Group chat not found", 404);

const badRequest = (msg = "All fields are required") =>
  Utils.Response.error(msg, 400);

export { groupChatAlreadyExists, groupChatNotFound, badRequest, adminNotFound };
