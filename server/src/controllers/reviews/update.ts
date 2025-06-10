import * as Interfaces from "../../interfaces";
import * as Errors from "../../globals/errors";
import { prisma } from "../../utils";

const Update: Interfaces.Controllers.Async = async (req, res, next) => {
  const auth: string | undefined = req?.headers?.authorization;
  if (!auth) {
    return next(Errors.Destination.badRequest("Auth token is missing"));
  }

  const { reviewId } = req.params;
  const { comment, rating, userId } = req.body;

  if (!rating || !comment || !userId) {
    return next(Errors.Review.badRequest);
  }

  try {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return next(Errors.Review.reviewNotFound);
    }

    if (review.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        ...(comment !== undefined && { comment }),
        ...(rating !== undefined && { rating }),
        updatedAt: new Date(),
      },
    });

    res.status(200).json({ message: "Review updated", review: updatedReview });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default Update;
