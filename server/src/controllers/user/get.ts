import * as Interfaces from "../../interfaces";
import * as Errors from "../../globals/errors";
import { prisma } from "../../utils";

const GetUserCredits: Interfaces.Controllers.Async = async (req, res, next) => {
  const firebaseId = req.firebaseId;

  try {
    const user = await prisma.user.findUnique({
      where: { firebaseId: firebaseId },
    });

    if (!user) {
      return next(Errors.User.userNotFound);
    }

    res.status(200).json({
      message: "User credits retrieved successfully",
      data: Number(user.credits),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch user credits!" });
  }
};

export { GetUserCredits };