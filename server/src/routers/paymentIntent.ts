import { authenticateFirebase } from "src/middlewares/firebaseAuth";
import * as Controllers from "../controllers";
import express from "express";

const router = express.Router();

router.get("/get/:paymentIntent", authenticateFirebase, Controllers.PaymentIntent.GetPaymentIntent);




export default router;
