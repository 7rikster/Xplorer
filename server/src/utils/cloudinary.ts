import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload media to Cloudinary
export const uploadMediaToCloudinary = async (
  filePath: string
): Promise<UploadApiResponse> => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Could not upload file to Cloudinary");
  }
};

// Function to delete media from Cloudinary
export const deleteMediaFromCloudinary = async (
  publicId: string
): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete file from Cloudinary");
  }
};
