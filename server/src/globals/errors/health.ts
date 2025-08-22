import * as Utils from "../../utils/index.js";

const pingBody = Utils.Response.error(
  "Health Check Should Not Have A Body",
  400
);

export { pingBody };
