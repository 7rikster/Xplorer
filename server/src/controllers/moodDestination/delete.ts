import * as Interfaces from "../../interfaces";
import * as Errors from "../../globals/errors";
import { prisma } from "../../utils";

const Delete: Interfaces.Controllers.Async = async (req, res, next) => {
  const firebaseId = req.firebaseId;
  const user = await prisma.user.findUnique({
    where: { firebaseId },
  });
  if (!user) {
    return next(Errors.User.userNotFound);
  }

  try {
    await prisma.moodDestination.delete({
      where: { userId: user.id },
    });
    res.status(200).json({
      message: "Mood destination deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return next(Errors.System.serverError);
  }
};

export default Delete;
