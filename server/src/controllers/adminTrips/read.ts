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
    return res
      .status(500)
      .json({ error: "Failed to fetch trip details!" });
  }
};

const ReadAll: Interfaces.Controllers.Async = async (req, res, next) => {
  try {
    const trips = await prisma.adminTrip.findMany();

    return res.status(200).json({
      message: "Trips retrieved successfully",
      data: trips,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch trips!" });
  }
};

export { Read, ReadAll };
