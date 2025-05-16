import * as Interfaces from "../../interfaces";
import * as Errors from "../../globals/errors";
import { prisma } from "../../utils";

const Create: Interfaces.Controllers.Async = async (req, res, next) => {
  try {
    const auth: string | undefined = req?.headers?.authorization;
    if (!auth) {
      return next(Errors.User.badRequest("Auth token is missing"));
    }
    const user: Interfaces.User.CreateUserBody = req.body;
    let { name, email, userName, photoUrl, firebaseId } = user;

    if (!name || !userName || !email || !firebaseId) {
      return next(
        Errors.User.badRequest(
          "First Name, username, email, and Firebase ID are required"
        )
      );
    }

    email = email.trim();
    userName = userName.trim();
    name = name.trim();
    photoUrl = photoUrl?.trim() || "";
    firebaseId = firebaseId?.trim();

    const idToken: string = (auth as string).split(" ")[1];

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { userName }],
      },
    });
    if (existingUser) {
      return next(Errors.User.userAlreadyExists);
    }

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        firebaseId,
        userName,
        photoUrl,
        role: "CLIENT",
      },
    });

    return res.status(201).json({
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    console.error("Create User Error:", error);
    return next(Errors.System.serverError);
  }
};

export default Create;
