import * as Interfaces from "../../interfaces/index.js";
import * as Errors from "../../globals/errors/index.js";
import { prisma } from "../../utils/index.js";

const Create: Interfaces.Controllers.Async = async (req, res, next) => {
  const auth: string | undefined = req?.headers?.authorization;
  if (!auth) {
    return next(Errors.Destination.badRequest("Auth token is missing"));
  }
  let { rating, comment, userId, userDisplayName, userPhoto, tripId, imageUrl, publicId } = req.body;

    if (!rating || !comment || !userId || !userDisplayName || !userPhoto || !tripId) {
        return next(Errors.Review.badRequest);
    }
    imageUrl = imageUrl || "";
    publicId = publicId || "";
    if (typeof rating !== "number" || rating < 1 || rating > 5) {
        return next(Errors.Review.badRequest("Rating must be a number between 1 and 5"));
    }
    comment = comment.trim();
    userId = userId.trim();
    userDisplayName = userDisplayName.trim();
    userPhoto = userPhoto.trim();
    tripId = tripId.trim();
    rating = Number(rating);
    const reviewExists = await prisma.review.count({
        where: {
            userId: userId,
            tripId: tripId
        },
    });
    if (reviewExists > 0) {
        return next(Errors.Review.reviewAlreadyExists);
    }
    try {
        const review = await prisma.review.create({
          data: {
            rating,
            comment,
            imageUrl,
            publicId,
            userDisplayName,
            userPhoto,
            userId,
            tripId,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
        res.status(200).json({
          message: "Review created successfully",
          data: review,
        });
      } catch (error) {
        return next(Errors.System.serverError);
      }

}

export default Create;