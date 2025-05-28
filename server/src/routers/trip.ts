import * as Controllers from "../controllers";
import express from "express";

const router = express.Router();

router.post("/generate", Controllers.AiGeneratedTrip.Generate);
router.post("/create", Controllers.AdminTrips.Create);
router.get("/get/:id", Controllers.AdminTrips.Read);
router.get("/get", Controllers.AdminTrips.ReadAll);
router.delete("/delete/:id", Controllers.AdminTrips.Delete);

export default router;