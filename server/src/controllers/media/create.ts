import * as Interfaces from "../../interfaces";
import * as Errors from "../../globals/errors";
import { Request } from "express";
import { uploadMediaToCloudinary } from "src/utils/cloudinary";
import fs from "fs/promises";

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
      await fs.unlink(req.file.path);
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

const UploadMany: Interfaces.Controllers.Async = async (
  req: MulterRequest,
  res,
  next
) => {
  try {
    const auth: string | undefined = req?.headers?.authorization;
    if (!auth) {
      return next(Errors.Destination.badRequest("Auth token is missing"));
    }
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      return next(
        Errors.Destination.badRequest("Files are missing in the request.")
      );
    } else {
      const files = req.files as Express.Multer.File[];

      const uploadResults = await Promise.all(
        files.map(async (file) => {
          const result = await uploadMediaToCloudinary(file.path);
          await fs.unlink(file.path);
          return result.secure_url;
        })
      );
      res.status(200).json({
        success: true,
        data: uploadResults,
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

export { Create, UploadMany };
