import { authenticateFirebase } from "../middlewares/firebaseAuth.js";
import * as Controllers from "../controllers/index.js";
import express from "express";

const router = express.Router();

router.post("/add", authenticateFirebase, Controllers.GroupChat.Create);
router.get("/get-user-groups", authenticateFirebase, Controllers.GroupChat.getUserGroups);
router.get("/get-group-messages/:groupId", authenticateFirebase, Controllers.GroupChat.getGroupMessages);
// router.delete("/delete/:id", Controllers.GroupChat.Delete);

export default router;
