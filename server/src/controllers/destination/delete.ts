import * as Interfaces from "../../interfaces";
import * as Errors from "../../globals/errors";
import { prisma } from "../../utils";

const Delete: Interfaces.Controllers.Async = async (req, res, next) => {
  const { id } = req.params;

  try {
    await prisma.destination.delete({
      where: { id },
    });
    res.status(200).json({
      message: "Destination deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return next(Errors.System.serverError);
  }
};

export default Delete;
