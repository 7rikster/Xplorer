import * as Interfaces from "../../interfaces/index.js";
import * as Errors from "../../globals/errors/index.js";
import { prisma } from "../../utils/index.js";


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

export default Read;