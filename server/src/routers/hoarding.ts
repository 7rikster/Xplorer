import express from 'express';
import * as Controllers from "../controllers/index.js";

const router = express.Router();

router.post("/add", Controllers.Hoarding.Create);
router.delete("/delete/:id", Controllers.Hoarding.Delete);
router.get("/get/:id", Controllers.Hoarding.Read);
router.get("/get", Controllers.Hoarding.ReadAll);

export default router;