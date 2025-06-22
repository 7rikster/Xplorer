import * as Interfaces from "../../interfaces";
import * as Errors from "../../globals/errors";
import { prisma } from "../../utils";


const Read: Interfaces.Controllers.Async = async (req, res, next) => {
  const { id } = req.params;

  try {
    const trip = await prisma.userTrip.findUnique({
      where: { id },
    });

    if (!trip) {
      return next(Errors.Trip.tripNotFound);
    }

    res.status(200).json({
      message: "Trip retrieved successfully",
      data: trip,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch trip details!" });
  }
};

const CursorBasedRead: Interfaces.Controllers.Async = async (
  req,
  res,
  next
) => {
  try {
    const limit = parseInt(req.query.limit as string) || 4;
    const cursor = req.query.cursor as string | undefined;
    const firebaseId = req.firebaseId;
    const user = await prisma.user.findUnique({
        where: {firebaseId}
    })

    if(!user){
        return next(Errors.User.userNotFound);
    }
    

    const trips = await prisma.userTrip.findMany({
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      where: {
        userId: user.id,
      },
    });

    const nextCursor =
      trips.length === limit ? trips[trips.length - 1].id : null;

    return res.status(200).json({
      data: trips,
      pagination: {
        nextCursor,
        hasMore: !!nextCursor,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch trips" });
  }
};

export { Read, CursorBasedRead };
