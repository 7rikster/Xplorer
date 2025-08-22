import * as Controllers from "../controllers/index.js";
import express from "express";

const router = express.Router();

router.post("/generate", Controllers.AiGeneratedTrip.Generate);
router.post("/create", Controllers.AdminTrips.Create);
router.get("/get/:id", Controllers.AdminTrips.Read);
router.get("/get", Controllers.AdminTrips.PageBasedRead);
router.get("/get-all", Controllers.AdminTrips.CursorBasedRead);
router.delete("/delete/:id", Controllers.AdminTrips.Delete);

export default router;