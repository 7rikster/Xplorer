import express from "express";
import multer from "multer";
import * as Controlers from "../controllers/index.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), Controlers.Media.Create);
router.post("/upload-many", upload.array("files",3), Controlers.Media.UploadMany);
router.delete("/delete/:public_id", Controlers.Media.Delete);

export default router;
