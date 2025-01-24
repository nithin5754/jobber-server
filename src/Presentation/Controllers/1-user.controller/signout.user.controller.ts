import { Request, Response, NextFunction } from "express";
import { IController } from "../../../Shared/IControllers";


export class SignOut implements IController {
  constructor() {
    
  }
public async handle(req: Request, res: Response, next: NextFunction): Promise<any> {
    
  try {
    const cookies = req.cookies;
  
  

    if (!cookies?.jwt) return res.sendStatus(204);
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production"  
    });

    

    return res.status(200).json({ message: "cookie cleared",user:{} });
  } catch (error) {
    next(error);
  }




  }



}