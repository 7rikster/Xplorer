import { authenticateFirebase } from "src/middlewares/firebaseAuth";
import * as Controllers from "../controllers";
import express from "express";

const router = express.Router();

router.post("/search", Controllers.User.SearchUsers);
router.get("/all", authenticateFirebase, Controllers.User.getAllUsers);
router.get("/credits", authenticateFirebase, Controllers.User.GetUserCredits);
router.patch("/credits", authenticateFirebase, Controllers.User.UpdateUserCredits);

export default router;