import { authenticateFirebase } from "../middlewares/firebaseAuth.js";
import * as Controllers from "../controllers/index.js";
import express from "express";

const router = express.Router();

router.post("/create", authenticateFirebase, Controllers.Expense.Create);
router.get("/get-user-expenses", authenticateFirebase, Controllers.Expense.ReadUserExpenses);



export default router;
