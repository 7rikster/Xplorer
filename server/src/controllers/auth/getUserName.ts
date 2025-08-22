import * as Interfaces from "../../interfaces/index.js";
import * as Errors from "../../globals/errors/index.js";
import { prisma } from "../../utils/index.js";

const GetUserName: Interfaces.Controllers.Async = async (req, res, next) => {
  try {
    const { userName } = req.params;

    if (!userName) {
      return next(Errors.User.badRequest("Username is required"));
    }

    const user = await prisma.user.findUnique({
      where: {
        userName,
      },
    });

    if (!user) {
      return res.status(200).json({
        message: "User not found",
        data: null,
      });
    }

    return res.status(200).json({
      message: "User found",
      data: user,
    });
  } catch (error) {
    return console.error(error);
  }
};

const GetUser: Interfaces.Controllers.Async = async (req, res, next) => {
  const auth: string | undefined = req?.headers?.authorization;
  if (!auth) {
    return next(Errors.User.badRequest("Auth token is missing"));
  }

  try {
    const { email } = req.params;

    if (!email) {
      return next(Errors.User.badRequest("Email is required"));
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return next(Errors.User.userNotFound);
    }

    return res.status(200).json({
      message: "User found",
      data: user,
    });
  } catch (error) {
    return console.error(error);
  }
};

export { GetUserName, GetUser };
