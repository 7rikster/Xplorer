import * as Interfaces from "../../interfaces";
import * as Errors from "../../globals/errors";
import { prisma } from "../../utils";

const Read: Interfaces.Controllers.Async = async (req, res, next) => {
  const { id } = req.params;

  try {
    const hoarding = await prisma.hoarding.findUnique({
      where: { id },
    });

    if (!hoarding) {
      return next(Errors.Destination.destinationNotFound);
    }

    res.status(200).json({
      message: "Hoarding retrieved successfully",
      data: hoarding,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch hoarding details!" });
  }
};

const ReadAll: Interfaces.Controllers.Async = async (req, res, next) => {
  try {
    const hoardings = await prisma.hoarding.findMany();

    return res.status(200).json({
      message: "Hoardings retrieved successfully",
      data: hoardings,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch hoardings!" });
  }
};

export { Read, ReadAll };
