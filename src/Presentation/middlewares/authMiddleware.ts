

import { NextFunction, Request, Response } from "express";
import { JwtToken } from "../../External-libraries/6-token.ts/jwt.token";


declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

const tokenClass = new JwtToken();

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
     
  // console.log(authHeader, "connection string");

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "unauthorized token string" });
  }

  const token = authHeader.split(" ")[1];

  let decodedToken = tokenClass.verifyAccessToken(token);
  // console.log(decodedToken, ":::----decoded token");

  if (typeof decodedToken !== "string" && decodedToken.userId) {
    req.userId = decodedToken.userId;
    // console.log("is verified");

    next();
  } else {
    return res.status(403).json({ message: "Forbidden" });
  }
};
