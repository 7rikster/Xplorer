import { authenticateFirebase } from "src/middlewares/firebaseAuth";
import * as Controllers from "../controllers";
import express from "express";

const router = express.Router();

router.post("/create", authenticateFirebase, Controllers.TripBooking.Create);
router.patch("/update", authenticateFirebase, Controllers.TripBooking.Update);
router.get("/user/get-trips", authenticateFirebase, Controllers.TripBooking.GetUserTripBookings);


export default router;
