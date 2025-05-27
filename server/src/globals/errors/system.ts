import * as Utils from "../../utils";

const serverError = (msg = "Internal Server error") => Utils.Response.error(msg);
const typeError = (msg = "Data Type Error") => Utils.Response.error(msg);

export { serverError, typeError };
