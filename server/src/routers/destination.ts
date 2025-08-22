import * as Controllers from "../controllers/index.js";
import express from "express";

const router = express.Router();

router.post("/add", Controllers.Destination.Create);
router.delete("/delete/:id", Controllers.Destination.Delete);
router.get("/get/:id", Controllers.Destination.Read);
router.get("/get", Controllers.Destination.ReadAll);

export default router;
