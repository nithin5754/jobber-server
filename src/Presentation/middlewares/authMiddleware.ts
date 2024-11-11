

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
    
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "unauthorized token string",user:{} });
  }

  const token = authHeader.split(" ")[1];

  let decodedToken = tokenClass.verifyAccessToken(token);


  if (typeof decodedToken !== "string" && decodedToken.userId) {
    req.userId = decodedToken.userId;
 

    next();
  } else {
    return res.status(403).json({ message: "Forbidden",user:{} });
  }
};
