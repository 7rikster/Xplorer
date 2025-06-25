import * as Interfaces from "../../interfaces";
import * as Errors from "../../globals/errors";
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();


const stripe = new Stripe(process.env.STRIPE_KEY as string, {
  apiVersion: "2025-05-28.basil",
});

const GetPaymentIntent: Interfaces.Controllers.Async = async (req, res, next) => {
    const { paymentIntent } = req.params;
  try {
    const pi = await stripe.paymentIntents.retrieve(paymentIntent as string);
    if (pi.status !== "succeeded") {
      return res.status(400).json({ error: "Payment not completed" });
    }
    res.status(200).json({ metadata: pi.metadata });
    
  } catch (error) {
    console.error("Stripe Error:", error);
    return next(Errors.System.serverError("Failed to retrieve payment intent"));
  }
};

export default GetPaymentIntent;
