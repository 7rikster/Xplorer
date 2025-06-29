import * as Interfaces from "../../interfaces";
import * as Errors from "../../globals/errors";
import { prisma } from "../../utils";

const Read: Interfaces.Controllers.Async = async (req, res, next) => {
  const firebaseId = req.firebaseId;
  const user = await prisma.user.findUnique({
    where: { firebaseId:firebaseId },
  });

  if (!user) {
    return next(Errors.User.userNotFound);
  }

  try {
    const moodDestination = await prisma.moodDestination.findFirst({
      where: { userId: user.id },
    });
    res.status(200).json({
      message: "Mood destinations retrieved successfully",
      data: moodDestination,
    });
  } catch (error) {
    console.error(error);
    return next(Errors.System.serverError);
  }
};

export default Read;
