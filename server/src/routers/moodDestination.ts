import { authenticateFirebase } from "../middlewares/firebaseAuth.js";
import * as Controllers from "../controllers/index.js";
import express from "express";

const router = express.Router();

router.post("/create", authenticateFirebase, Controllers.MoodDestination.Create);
router.delete("/delete", authenticateFirebase, Controllers.MoodDestination.Delete);
router.get("/get", authenticateFirebase, Controllers.MoodDestination.Read);

export default router;
