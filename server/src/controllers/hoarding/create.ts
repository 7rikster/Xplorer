import * as Interfaces from "../../interfaces";
import * as Errors from "../../globals/errors";
import { prisma } from "../../utils";

const Create: Interfaces.Controllers.Async = async (req, res, next) => {
  const auth: string | undefined = req?.headers?.authorization;
  if (!auth) {
    return next(Errors.Hoarding.badRequest("Auth token is missing"));
  }

  let { name, photoUrl, publicId, location, description, placeId } = req.body;

  if (
    !name ||
    !photoUrl ||
    !publicId ||
    !location ||
    !description ||
    !placeId
  ) {
    return next(Errors.Hoarding.badRequest);
  }

  name = name.trim();
  photoUrl = photoUrl.trim();
  publicId = publicId.trim();
  location = location.trim();
  description = description.trim();
  placeId = placeId.trim();

  const hoardingExists = await prisma.hoarding.count({
    where: {
      OR: [{ name: name }],
    },
  });

  if (hoardingExists > 0) {
    return next(Errors.Hoarding.hoardingAlreadyExists);
  }

  try {
    const hoarding = await prisma.hoarding.create({
      data: {
        name,
        photoUrl,
        publicId,
        location,
        description,
        placeId,
      },
    });
    res.status(200).json({
      message: "Hoarding created successfully",
      data: hoarding,
    });
  } catch (error) {
    return next(Errors.System.serverError);
  }
};

export default Create;