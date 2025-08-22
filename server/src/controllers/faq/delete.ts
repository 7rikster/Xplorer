import * as Interfaces from "../../interfaces/index.js";
import * as Errors from "../../globals/errors/index.js";
import { prisma } from "../../utils/index.js";

const Delete: Interfaces.Controllers.Async = async (req, res, next) => {
  const { id } = req.params;

  try {
    await prisma.faq.delete({
      where: { id },
    });
    res.status(200).json({
      message: "FAQ deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return next(Errors.System.serverError);
  }
};

export default Delete;
