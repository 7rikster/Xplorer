import * as Interfaces from "../../interfaces";
import * as Errors from "../../globals/errors";
import { prisma } from "../../utils";

const Create: Interfaces.Controllers.Async = async (req, res, next) => {
    const auth: string | undefined = req?.headers?.authorization;
    if (!auth) {
        return next(Errors.Destination.badRequest("Auth token is missing"));
    }
    const { imageUrls, tripDetail } = req.body;
    if (!imageUrls || !tripDetail) {
        return next(Errors.Destination.badRequest("Missing required fields"));
    }
    try {
        const trip = await prisma.adminTrip.create({
            data: {
                imageUrls: imageUrls,
                tripDetail: tripDetail,
                createdAt: new Date(),
            },
        });
        res.status(201).json({
            success: true,
            data: trip,
            message: "Trip Saved to Database successfully",
        });
    } catch (error) {
        console.error("Error Saving trip:", error);
        return next(Errors.System.serverError("Failed to Save trip To Database"));
    }
}

export default Create;