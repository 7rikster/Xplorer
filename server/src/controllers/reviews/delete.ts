import * as Interfaces from "../../interfaces";
import * as Errors from "../../globals/errors";
import { prisma } from "../../utils";

const Delete: Interfaces.Controllers.Async = async (req, res, next) => {
  const auth: string | undefined = req?.headers?.authorization;
  if (!auth) {
    return next(Errors.Destination.badRequest("Auth token is missing"));
  }
  const { id } = req.params;

  try {
    await prisma.review.delete({
      where: { id },
    });
    res.status(200).json({
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return next(Errors.System.serverError);
  }
};

export default Delete;
