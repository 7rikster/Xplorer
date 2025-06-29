import { authenticateFirebase } from "src/middlewares/firebaseAuth";
import * as Controllers from "../controllers";
import express from "express";

const router = express.Router();

router.post("/search", Controllers.User.SearchUsers);
router.get("/all", authenticateFirebase, Controllers.User.getAllUsers);
router.get("/credits", authenticateFirebase, Controllers.User.GetUserCredits);
router.patch("/credits", authenticateFirebase, Controllers.User.UpdateUserCredits);
router.patch("/profile", authenticateFirebase, Controllers.User.UpdateUserInfo);
router.get("/itineraries-count", authenticateFirebase, Controllers.User.getUserItinerariesCount);
router.get("/latest-itinerary", authenticateFirebase, Controllers.User.getUserlatestItinerary);
router.post("/mood-destination/generate", authenticateFirebase, Controllers.AISuggestion.Generate);

export default router;