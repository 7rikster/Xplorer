import * as Interfaces from "../../interfaces/index.js";
import * as Errors from "../../globals/errors/index.js";
import { prisma } from "../../utils/index.js";

const Read: Interfaces.Controllers.Async = async (req, res, next) => {
  const { id } = req.params;

  try {
    const destination = await prisma.destination.findUnique({
      where: { id },
    });

    if (!destination) {
      return next(Errors.Destination.destinationNotFound);
    }

    res.status(200).json({
      message: "Destination retrieved successfully",
      data: destination,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Failed to fetch destination details!" });
  }
};

const ReadAll: Interfaces.Controllers.Async = async (_, res) => {
  try {
    const destinations = await prisma.destination.findMany();

    return res.status(200).json({
      message: "Destinations retrieved successfully",
      data: destinations,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch destinations!" });
  }
};

export { Read, ReadAll };
