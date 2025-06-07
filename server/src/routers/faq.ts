import * as Controllers from "../controllers";
import express from "express";

const router = express.Router();

router.post("/add", Controllers.Faq.Create);
router.delete("/delete/:id", Controllers.Faq.Delete);
// router.get("/get/:id", Controllers.Faq.Read);
// router.get("/get", Controllers.Faq.ReadAll);

export default router;
