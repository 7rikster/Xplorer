import * as Interfaces from "../../interfaces";
import * as Errors from "../../globals/errors";
import { prisma } from "../../utils";

const Read: Interfaces.Controllers.Async = async (req, res, next) => {
  const { id } = req.params;

  try {
    const trip = await prisma.adminTrip.findUnique({
      where: { id },
      include: { faqs: true, reviews: true},
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
        take: limit,
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

const CursorBasedRead: Interfaces.Controllers.Async = async (
  req,
  res,
  next
) => {
  try {
    const limit = parseInt(req.query.limit as string) || 8;
    const cursor = req.query.cursor as string | undefined;

    const place = req.query.place as string | undefined;
    const groupType = req.query.groupType as string | undefined;
    const budget = req.query.budget as string | undefined;

    const where: any = {};

    if (place) {
      where.OR = [
        { city: { contains: place, mode: "insensitive" } },
        { country: { contains: place, mode: "insensitive" } },
      ];
    }
    if (groupType) {
      where.groupType = { equals: groupType };
    }
    if (budget) {
      where.budget = { equals: budget };
    }

    const trips = await prisma.adminTrip.findMany({
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      where,
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

export { Read, PageBasedRead, CursorBasedRead };
