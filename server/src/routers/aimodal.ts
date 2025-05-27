import * as Controllers from "../controllers";
import express from "express";

const router = express.Router();

router.post("/generate", Controllers.AiGeneratedTrip.Generate);

export default router;