import * as Interfaces from "../../interfaces/index.js";
import * as Errors from "../../globals/errors/index.js";
import { prisma } from "../../utils/index.js";

const GetUserCredits: Interfaces.Controllers.Async = async (req, res, next) => {
  const firebaseId = req.firebaseId;

  try {
    const user = await prisma.user.findUnique({
      where: { firebaseId: firebaseId },
    });

    if (!user) {
      return next(Errors.User.userNotFound);
    }

    res.status(200).json({
      message: "User credits retrieved successfully",
      data: Number(user.credits),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch user credits!" });
  }
};

const getUserItinerariesCount: Interfaces.Controllers.Async = async (req, res, next) => {
  const firebaseId = req.firebaseId;

  try {
    const user = await prisma.user.findUnique({
      where: { firebaseId: firebaseId },
    });

    if (!user) {
      return next(Errors.User.userNotFound);
    }

    const itinerariesCount = await prisma.userTrip.count({
      where: { userId: user.id },
    });

    res.status(200).json({
      message: "User itineraries count retrieved successfully",
      data: itinerariesCount,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch user itineraries count!" });
  }
}

const getUserlatestItinerary: Interfaces.Controllers.Async = async (req, res, next) => {
  const firebaseId = req.firebaseId;

  try {
    const user = await prisma.user.findUnique({
      where: { firebaseId: firebaseId },
    });

    if (!user) {
      return next(Errors.User.userNotFound);
    }

    const latestItinerary = await prisma.userTrip.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    if (!latestItinerary) {
      return res.status(404).json({ message: "No itineraries found for this user." });
    }

    res.status(200).json({
      message: "User latest itinerary retrieved successfully",
      data: latestItinerary,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch user's latest itinerary!" });
  }
}

export { GetUserCredits, getUserItinerariesCount, getUserlatestItinerary };