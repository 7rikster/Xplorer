import { authenticateFirebase } from "../middlewares/firebaseAuth.js";
import * as Controllers from "../controllers/index.js";
import express from "express";

const router = express.Router();

router.post("/create", authenticateFirebase, Controllers.TripBooking.Create);
router.patch("/update", authenticateFirebase, Controllers.TripBooking.Update);
router.get("/user/get-trips", authenticateFirebase, Controllers.TripBooking.GetUserTripBookings);
router.get("/user/get-upcoming-trip", authenticateFirebase, Controllers.TripBooking.GetUserUpcomingTrip);


export default router;
