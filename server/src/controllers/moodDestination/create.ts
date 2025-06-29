import * as Interfaces from "../../interfaces";
import * as Errors from "../../globals/errors";
import { prisma } from "../../utils";

const Create: Interfaces.Controllers.Async = async (req, res, next) => {
  let { imageUrl, place, country, description } = req.body;

  if (!imageUrl || !place || !country || !description) {
    return next(Errors.Faq.badRequest);
  }

  imageUrl = imageUrl.trim();
  place = place.trim();
  country = country.trim();
  description = description.trim();
  const firebaseId = req.firebaseId;

  const user = await prisma.user.findUnique({
    where: {
      firebaseId: firebaseId,
    },
  });
  if (!user) {
    return next(Errors.User.userNotFound);
  }
  const moodDestinationExists = await prisma.moodDestination.count({
    where: {
      userId: user.id,
    },
  });

  if (moodDestinationExists > 0) {
    return next(Errors.MoodDestination.moodDestinationAlreadyExists);
  }
  try {
    const moodDestination = await prisma.moodDestination.create({
      data: {
        imageUrl,
        place,
        country,
        description,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });
    res.status(200).json({
      message: "Mood destination created successfully",
      data: moodDestination,
    });
  } catch (error) {
    return next(Errors.System.serverError);
  }
};

export default Create;
