import * as Interfaces from "../../interfaces";
import * as Errors from "../../globals/errors";
import { prisma } from "../../utils";
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_KEY || "");

const Create: Interfaces.Controllers.Async = async (req, res, next) => { 
  const { packageType, userId, totalAmount, credits } = req.body;
  if (!packageType || !userId || !totalAmount || !credits) {
    return next(Errors.Destination.badRequest("Missing required fields"));
  }
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Number(totalAmount) * 100,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        type: "credits",
        credits: Number(credits),
        plan: packageType,
        userId: userId.toString(),
      },
    });
    await prisma.creditsPurchase.create({
      data: {
        user: {
          connect: { id: userId.toString() },
        },
        packageType,
        totalAmount: paymentIntent.amount / 100,
        paymentIntent: paymentIntent.id,
      },
    });
    return res.status(201).json({
      message: "Credits purchase Created Successfully",
      client_secret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating credits purchase:", error);
    return next(
      Errors.System.serverError("Failed to save credits purchase to database")
    );
  }
};

export default Create;
