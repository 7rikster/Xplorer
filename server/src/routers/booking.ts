import { authenticateFirebase } from "src/middlewares/firebaseAuth";
import * as Controllers from "../controllers";
import express from "express";

const router = express.Router();

router.post("/create", authenticateFirebase, Controllers.Booking.Create);
router.patch("/update", authenticateFirebase, Controllers.Booking.Update);
router.get("/user/get-trips", authenticateFirebase, Controllers.Booking.GetUserTripBookings);


export default router;
