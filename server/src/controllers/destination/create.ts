import * as Interfaces from "../../interfaces/index.js";
import * as Errors from "../../globals/errors/index.js";
import { prisma } from "../../utils/index.js";

const Create: Interfaces.Controllers.Async = async (req, res, next) => {
  const auth: string | undefined = req?.headers?.authorization;
  if (!auth) {
    return next(Errors.Destination.badRequest("Auth token is missing"));
  }

  let { placeId, name, photoUrl, rating, publicId, location } = req.body;

  if (!placeId || !name || !photoUrl || !rating || !publicId || !location) {
    return next(Errors.Destination.badRequest);
  }

  placeId = placeId.trim();
  name = name.trim();
  photoUrl = photoUrl.trim();
  publicId = publicId.trim();
  location = location.trim();

  const destinationExists = await prisma.destination.count({
    where: {
      OR: [{ placeId: placeId }, { name: name }],
    },
  });

  if (destinationExists > 0) {
    return next(Errors.Destination.destinationAlreadyExists);
  }

  try {
    const destination = await prisma.destination.create({
      data: {
        placeId,
        name,
        photoUrl,
        publicId,
        rating,
        location
      },
    });
    res.status(200).json({
      message: "Destination created successfully",
      data: destination,
    });
  } catch (error) {
    return next(Errors.System.serverError);
  }
};

export default Create;
