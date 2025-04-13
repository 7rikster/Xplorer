import * as Interfaces from "../../interfaces";
import * as Errors from "../../globals/errors";
import { Request } from "express";
import { uploadMediaToCloudinary } from "src/utils/cloudinary";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

const Create: Interfaces.Controllers.Async = async (
  req: MulterRequest,
  res,
  next
) => {
  try {
    const auth: string | undefined = req?.headers?.authorization;
    if (!auth) {
      return next(Errors.Destination.badRequest("Auth token is missing"));
    }
    if (!req.file) {
      next(Errors.Destination.badRequest("File is missing in the request."));
    } else {
      const result = await uploadMediaToCloudinary(req.file.path);
      res.status(200).json({
        success: true,
        data: result,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error uploading file to cloudinary",
    });
  }
};

export default Create;
