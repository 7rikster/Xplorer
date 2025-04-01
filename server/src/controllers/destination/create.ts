import * as Interfaces from "../../interfaces";
import * as Errors from "../../globals/errors";
import { prisma } from "../../utils";

const Create: Interfaces.Controllers.Async = async (req, res, next) => {
  let { placeId, name, photoUrl, rating } = req.body;

  if (!placeId || !name || !photoUrl || !rating) {
    return next(Errors.Destination.badRequest);
  }

  placeId = placeId.trim();
  name = name.trim();
  photoUrl = photoUrl.trim();

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
        rating,
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
