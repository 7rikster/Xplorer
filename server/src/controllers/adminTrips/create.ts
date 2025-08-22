import * as Interfaces from "../../interfaces/index.js";
import * as Errors from "../../globals/errors/index.js";
import { prisma } from "../../utils/index.js";

const Create: Interfaces.Controllers.Async = async (req, res, next) => {
    const auth: string | undefined = req?.headers?.authorization;
    if (!auth) {
        return next(Errors.Destination.badRequest("Auth token is missing"));
    }
    const { imageUrls, tripDetail, city, country, groupType, budget } = req.body;
    if (!imageUrls || !tripDetail || !country || !groupType || !budget) {
        return next(Errors.Destination.badRequest("Missing required fields"));
    }
    try {
        const trip = await prisma.adminTrip.create({
            data: {
                imageUrls: imageUrls,
                tripDetail: tripDetail,
                city: city,
                country: country,
                groupType: groupType,
                budget: budget,
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