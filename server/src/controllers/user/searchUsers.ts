import * as Interfaces from "../../interfaces";
import * as Errors from "../../globals/errors";
import { prisma } from "../../utils";

const SearchUsers: Interfaces.Controllers.Async = async (req, res, next) => {
  try {
    const auth: string | undefined = req?.headers?.authorization;
    if (!auth) {
      return next(Errors.Destination.badRequest("Auth token is missing"));
    }

    const { searchTerm, userId } = req.body;

    if (searchTerm === undefined || searchTerm === null) {
      return res.status(400).send("searchTerm is required.");
    }

    const contacts = await prisma.user.findMany({
      where: {
        AND: [
          {
            id: {
              not: userId,
            },
            role: {
              not: "ADMIN",
            },
          },
          {
            OR: [
              { userName: { contains: searchTerm, mode: "insensitive" } },
              { name: { contains: searchTerm, mode: "insensitive" } },
              { email: { contains: searchTerm, mode: "insensitive" } },
            ],
          },
        ],
      },
    });

    return res.status(200).json(contacts);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
};

const getAllUsers: Interfaces.Controllers.Async = async (req, res, next) => {
  try {
    const auth: string | undefined = req?.headers?.authorization;
    if (!auth) {
      return next(Errors.Destination.badRequest("Auth token is missing"));
    }
    const users = await prisma.user.findMany({
      where: {
        AND: [
          {
            firebaseId: {
              not: req.firebaseId,
            },
            role: {
              not: "ADMIN",
            },
          },
        ],
      },
      select: {
        name: true,
        email: true,
        id: true,
        photoUrl: true,
      },
    });

    return res.status(200).json({
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
};

export { SearchUsers, getAllUsers };
