import { NextFunction, Request, Response } from "express";



export class SignOut {
  constructor() {
    
  }



  onLogOut = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
    try {
      const cookies = req.cookies;
      console.log(cookies, "jwt");

      if (!cookies?.jwt) return res.sendStatus(204);
      res.clearCookie("jwt", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"  
      });

      return res.status(200).json({ message: "cookie cleared",user:{} });
    } catch (error) {
      next(error);
    }
  };
}