import * as Controllers from "../controllers/index.js";
import express from "express";

const router = express.Router();

router.get("/get/:id", Controllers.SharedItinerary.Read);

export default router;