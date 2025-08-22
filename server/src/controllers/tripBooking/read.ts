import * as Interfaces from "../../interfaces/index.js";
import * as Errors from "../../globals/errors/index.js";
import { prisma } from "../../utils/index.js";

const GetUserTripBookings: Interfaces.Controllers.Async = async (
  req,
  res,
  next
) => {
  const firebaseId = req.firebaseId;
  const user = await prisma.user.findUnique({
    where: { firebaseId },
  });
  if (!user) {
    return next(Errors.User.userNotFound);
  }
  try {
    const bookings = await prisma.tripBooking.findMany({
      where: { userId: user.id, isCompleted: true },
      include: {
        trip: true,
      },
    });
    return res.status(200).json({
      message: "User Trip Bookings Retrieved Successfully",
      data: bookings,
    });
  } catch (error) {
    console.error("Error fetching user trip bookings:", error);
    return next(
      Errors.System.serverError(
        "Failed to fetch user trip bookings from Database"
      )
    );
  }
};

const GetUserUpcomingTrip: Interfaces.Controllers.Async = async (
  req,
  res,
  next
) => {
  const firebaseId = req.firebaseId;

  const user = await prisma.user.findUnique({
    where: { firebaseId },
  });

  if (!user) {
    return next(Errors.User.userNotFound);
  }

  try {
    const today = new Date();

    const upcomingTrip = await prisma.tripBooking.findFirst({
      where: {
        userId: user.id,
        isCompleted: true,
        startDate: {
          gt: today,
        },
      },
      include: {
        trip: true,
      },
      orderBy: {
        startDate: "asc",
      },
    });

    const totalTripsCount = await prisma.tripBooking.count({
      where: {
        userId: user.id,
        isCompleted: true,
      },
    });

    const upcomingTripsCount = await prisma.tripBooking.count({
      where: {
        userId: user.id,
        isCompleted: true,
        startDate: {
          gt: today,
        },
      },
    });

    return res.status(200).json({
      message: "Upcoming trip retrieved successfully",
      data: {
        upcomingTrip: upcomingTrip || null,
        totalTripsCount,
        upcomingTripsCount,
      }
    });
  } catch (error) {
    console.error("Error fetching upcoming trip:", error);
    return next(
      Errors.System.serverError("Failed to fetch upcoming trip from database")
    );
  }
};

export  {GetUserTripBookings, GetUserUpcomingTrip};
