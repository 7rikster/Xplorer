import * as Interfaces from "../interfaces/index.js";
import admin from "../utils/firebaseAdmin.js";

declare module "express" {
  export interface Request {
    firebaseId?: string;
  }
}

export const authenticateFirebase: Interfaces.Middlewares.Async = async (
  req,
  res,
  next
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    console.log("No authorization header found");
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.firebaseId = decodedToken.uid;
    return next();
  } catch (error) {
    console.error("Token verification failed", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};
