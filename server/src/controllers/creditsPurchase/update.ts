import * as Interfaces from "../../interfaces";
import * as Errors from "../../globals/errors";
import { prisma } from "../../utils";


const Update: Interfaces.Controllers.Async = async (req, res, next) => {
  const {paymentIntent} = req.body;
    if (!paymentIntent) {
        return next(Errors.Destination.badRequest("Missing required fields"));
    }
  try {
    const history = await prisma.creditsPurchase.findFirst({
      where: { paymentIntent: paymentIntent },
    });
    if(history?.isCompleted) {
      return res.status(400).json({
        message: "Credit purchase already completed",
      });
    }
    await prisma.creditsPurchase.update({
      where: { paymentIntent: paymentIntent },
        data: {
            isCompleted: true,
        },
    });
    return res.status(200).json({
        message: "Credit purchase Updated Successfully",
    })
    
  } catch (error) {
    console.error("Error Saving credit purchase:", error);
    return next(Errors.System.serverError("Failed to Save credit purchase To Database"));
  }
};

export default Update;
