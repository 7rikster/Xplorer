import * as Controllers from "../controllers";
import express from "express";

const router = express.Router();

router.post("/generate", Controllers.AiGeneratedTrip.Generate);
router.post("/create", Controllers.AdminTrips.Create);

export default router;