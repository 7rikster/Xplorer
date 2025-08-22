import * as Interfaces from "../../interfaces/index.js";
import * as Errors from "../../globals/errors/index.js";
import { prisma } from "../../utils/index.js";

const UpdateUserCredits: Interfaces.Controllers.Async = async (
  req,
  res,
  next
) => {
  const firebaseId = req.firebaseId;
  const { credits } = req.body;

  try {
    const user = await prisma.user.update({
      where: { firebaseId: firebaseId },
      data: {
        credits: credits,
      },
    });
    if (!user) {
      return next(Errors.User.userNotFound);
    }
    res.status(200).json({
      message: "User credits retrieved successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch user credits!" });
  }
};

const UpdateUserInfo: Interfaces.Controllers.Async = async (req, res, next) => {
  const firebaseId = req.firebaseId;
  const { name, username, photoUrl } = req.body;

  try {
    const user = await prisma.user.update({
      where: { firebaseId: firebaseId },
      data: {
        name: name,
        userName: username,
        photoUrl: photoUrl,
      },
    });
    if (!user) {
      return next(Errors.User.userNotFound);
    }
    res.status(200).json({
      message: "User info updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch user info!" });
  }
};

export { UpdateUserCredits, UpdateUserInfo };
