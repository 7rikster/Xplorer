import * as Interfaces from "../../interfaces";
import * as Errors from "../../globals/errors";
import { prisma } from "../../utils";

const Create: Interfaces.Controllers.Async = async (req, res, next) => {
    
    const { imageUrls, tripDetail, city, country, groupType, budget } = req.body;
    const firebaseId = req.firebaseId;
    const user = await prisma.user.findUnique({
      where: { firebaseId },
    });
    if( !user || user.role === "ADMIN") {
        return next(Errors.User.userNotFound);
    }

    if (!imageUrls || !tripDetail || !country || !groupType || !budget) {
        return next(Errors.Destination.badRequest("Missing required fields"));
    }
    try {
        const trip = await prisma.userTrip.create({
            data: {
                user: {
                    connect: { id: user.id }
                },
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