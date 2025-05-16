import * as Controllers from "../controllers";
import express from "express";

const router = express.Router();

router.post("/signup", Controllers.Auth.Create);
router.get("/username/:userName", Controllers.Auth.GetUserName);
router.get("/user/:email", Controllers.Auth.GetUser);


export default router;
