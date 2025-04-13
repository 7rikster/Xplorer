import express from "express";
import multer from "multer";
import * as Controlers from "../controllers";

const router = express.Router();
const upload = multer({dest: 'uploads/'});

router.post("/upload", upload.single("file"), Controlers.Media.Create);
router.delete("/delete/:id", Controlers.Media.Delete);

export default router;