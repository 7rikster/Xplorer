import * as Interfaces from "../../interfaces";
import * as Errors from "../../globals/errors";

import { deleteMediaFromCloudinary } from "src/utils/cloudinary";


const Delete : Interfaces.Controllers.Async = async (req, res, next) => {
    try {
        const { public_id } = req.params;
    
        if (!public_id) {
        return next(Errors.Destination.badRequest("Public ID is required."));
        }
    
        await deleteMediaFromCloudinary(public_id);
    
        res.status(200).json({
        success: true,
        message: "File deleted successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
        success: false,
        message: "Error deleting file from cloudinary",
        });
    }
}

export default Delete;