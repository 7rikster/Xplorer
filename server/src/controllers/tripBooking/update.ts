import * as Interfaces from "../../interfaces";
import * as Errors from "../../globals/errors";
import { prisma } from "../../utils";


const Update: Interfaces.Controllers.Async = async (req, res, next) => {
  const {paymentIntent} = req.body;
    if (!paymentIntent) {
        return next(Errors.Destination.badRequest("Missing required fields"));
    }
  try {
    await prisma.tripBooking.update({
      where: { paymentIntent: paymentIntent },
        data: {
            isCompleted: true,
        },
    });
    return res.status(200).json({
        message: "Trip Booking Updated Successfully",
    })
    
  } catch (error) {
    console.error("Error Saving trip:", error);
    return next(Errors.System.serverError("Failed to Save trip To Database"));
  }
};

export default Update;
