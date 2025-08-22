import * as Controllers from "../controllers/index.js";
import express from "express";

const router = express.Router();

router.post("/get", Controllers.DestinationDetails.Create);


export default router;
