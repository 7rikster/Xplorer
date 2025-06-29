import * as Interfaces from "../../interfaces";
import * as Errors from "../../globals/errors";
import { getAISuggestedDestination } from "src/utils/moodBasedSuggestion";
import { prisma } from "src/utils";

const Generate: Interfaces.Controllers.Async = async (req, res, next) => {
  const { mood } = req.body;

  if (!mood) {
    return next(Errors.Destination.badRequest("Missing required fields"));
  }

  try {
    const result = await getAISuggestedDestination({
      mood,
    });
    if (!result) {
      return next(Errors.Destination.badRequest("Failed to generate trip"));
    }

    return res.status(200).json({
      success: true,
      data: result,
      message: "Trip generated successfully",
    });
  } catch (error) {
    console.error("Error generating trip:", error);
    return res.status(500).json({
      message:
        "An error occurred while generating the trip. Please try again later.",
    });
  }
};

export default Generate;
