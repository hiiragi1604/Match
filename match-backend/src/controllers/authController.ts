import { Request, Response, NextFunction } from "express";
import { auth } from "../config/firebase-admin";

//Verify user token
export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.body;

    //Verify user token
    const decodedToken = await auth.verifyIdToken(token);

    //Get user data
    const user = await auth.getUser(decodedToken.uid);

    if (!user) {
       res.status(401).json({ message: "Token verification failed" });
       return;
    }

    res.status(200).json({ message: "Token verified successfully", user });
    return;
  } catch (error) {
    next(error);
  }
};

//
