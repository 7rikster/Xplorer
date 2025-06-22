import { authenticateFirebase } from "src/middlewares/firebaseAuth";
import * as Controllers from "../controllers";
import express from "express";

const router = express.Router();

router.post("/create",authenticateFirebase, Controllers.UserTrips.Create);
router.get("/get/:id",authenticateFirebase, Controllers.UserTrips.Read);
router.get("/get-all",authenticateFirebase, Controllers.UserTrips.CursorBasedRead);

export default router;