import * as Interfaces from "../../interfaces";
import * as Errors from "../../globals/errors";
import { prisma } from "../../utils";

const Read: Interfaces.Controllers.Async = async (req, res, next) => {
  const { id } = req.params;

  try {
    const trip = await prisma.adminTrip.findUnique({
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

const PageBasedRead: Interfaces.Controllers.Async = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 8;
    const skip = (page - 1) * limit;

    const [trips, totalItems] = await Promise.all([
      prisma.adminTrip.findMany({
        skip,
        take: limit
      }),
      prisma.adminTrip.count(),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return res.status(200).json({
      data: trips,
      pagination: {
        totalItems,
        totalPages,
        currentPage: page,
        pageSize: limit,
        hasMore: page < totalPages,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch trips" });
  }
};

export { Read, PageBasedRead };
