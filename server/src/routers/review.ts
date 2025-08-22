import * as Controllers from "../controllers/index.js";
import express from "express";

const router = express.Router();

router.post("/add", Controllers.Review.Create);
router.delete("/delete/:id", Controllers.Review.Delete);
router.put("/update/:reviewId", Controllers.Review.Update);
// router.get("/get/:id", Controllers.Review.Read);
// router.get("/get", Controllers.Review.ReadAll);

export default router;
