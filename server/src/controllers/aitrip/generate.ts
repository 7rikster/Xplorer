import * as Interfaces from "../../interfaces/index.js";
import * as Errors from "../../globals/errors/index.js";
import { getAIGeneratedTrip } from "../../utils/AImodal.js";

const Generate: Interfaces.Controllers.Async = async (req, res, next) => {
  const auth: string | undefined = req?.headers?.authorization;
  if (!auth) {
    return next(Errors.Destination.badRequest("Auth token is missing"));
  }

  const { location, numberOfDays, travelStyle, interests, budget, groupType } =
    req.body;

  if (
    !location ||
    !numberOfDays ||
    !travelStyle ||
    !interests ||
    !budget ||
    !groupType
  ) {
    return next(Errors.Destination.badRequest("Missing required fields"));
  }

  try {
    const result = await getAIGeneratedTrip({location, numberOfDays, travelStyle, interests, budget, groupType});
    if (!result) {
      return next(Errors.Destination.badRequest("Failed to generate trip"));
    }
    res.status(200).json({
      success: true,
      data: result,
      message: "Trip generated successfully"
    });
  } catch (error) {
    console.error("Error generating trip:", error);
    res.status(500).json({
        message: "An error occurred while generating the trip. Please try again later." 
    });
  }
};

export default Generate;
