import { authenticateFirebase } from "../middlewares/firebaseAuth.js";
import * as Controllers from "../controllers/index.js";
import express from "express";

const router = express.Router();

router.post("/create", authenticateFirebase, Controllers.CreditsPurchase.Create);
router.patch("/update", authenticateFirebase, Controllers.CreditsPurchase.Update);
router.get("/get-user-purchases", authenticateFirebase, Controllers.CreditsPurchase.ReadUserCreditPurchases);



export default router;
