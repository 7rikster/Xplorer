import * as Interfaces from "../../interfaces";
import * as Errors from "../../globals/errors";
import { prisma } from "../../utils";
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_KEY || "");

const Create: Interfaces.Controllers.Async = async (req, res, next) => {
  const { bookingId, bookingType, userId, details, totalAmount } = req.body;
  if (!bookingId || !bookingType || !userId || !details || !totalAmount) {
    return next(Errors.Destination.badRequest("Missing required fields"));
  }
  try {
    let bookingDetails;
    switch (bookingType) {
      case "trip":
        bookingDetails = await prisma.adminTrip.findUnique({
          where: { id: bookingId },
        });
    }
    if (bookingType === "trip" && bookingDetails) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: totalAmount*100,
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
        },
        metadata:{
          type: "trip",
          tripId: bookingDetails.id.toString(),
          userId: userId.toString(),
          location: details.location || "",
          totalAmount: Number(totalAmount),
        }
      });
      await prisma.tripBooking.create({
        data: {
          trip: {
            connect: { id: bookingDetails.id.toString() },
          },
          user: {
            connect: { id: userId.toString() },
          },
          adults: details.adults,
          children: details.children,
          startDate: details.startDate,
          endDate: details.endDate,
          totalAmount: paymentIntent.amount/100,
          paymentIntent: paymentIntent.id,
        },
      });
        return res.status(201).json({
            message: "Trip Booking Created Successfully",
            client_secret: paymentIntent.client_secret,
        });
    }
  } catch (error) {
    console.error("Error Saving trip:", error);
    return next(Errors.System.serverError("Failed to Save trip To Database"));
  }
};

export default Create;
