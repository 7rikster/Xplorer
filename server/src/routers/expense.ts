import { authenticateFirebase } from "src/middlewares/firebaseAuth";
import * as Controllers from "../controllers";
import express from "express";

const router = express.Router();

router.post("/create", authenticateFirebase, Controllers.Expense.Create);
router.get("/get-user-expenses", authenticateFirebase, Controllers.Expense.ReadUserExpenses);



export default router;
