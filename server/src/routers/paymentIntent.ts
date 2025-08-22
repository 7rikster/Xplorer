import { authenticateFirebase } from "../middlewares/firebaseAuth.js";
import * as Controllers from "../controllers/index.js";
import express from "express";

const router = express.Router();

router.get("/get/:paymentIntent", authenticateFirebase, Controllers.PaymentIntent.GetPaymentIntent);




export default router;
