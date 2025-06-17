import * as Interfaces from "../interfaces";
import admin from "../utils/firebaseAdmin";
import { Request } from "express";

declare module "express" {
  export interface Request {
    firebaseId?: string;
  }
}

export const authenticateFirebase: Interfaces.Middlewares.Async = async (req,res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.firebaseId = decodedToken.uid; 
    next();
  } catch (error) {
    console.error("Token verification failed", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};
