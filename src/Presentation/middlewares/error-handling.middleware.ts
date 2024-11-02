import { NextFunction, Request, Response } from "express"
import { CustomError } from "../error/error.interface"


const ErrorHandlingMiddleWare = (
  err:Error,
  req:Request,
  res:Response,
  next:NextFunction

):void=> {


  if(err instanceof CustomError){
    const errResponse=err.serializeErrors()

    console.log(errResponse,"my error");
    

     res.status(errResponse.statusCode).json({
      message:errResponse.message,
      status:errResponse.status,
      comingFrom:errResponse.comingFrom,
    })
  }else{
    res.status(500).json({
      message:"Internal Server Error"
    })
  }



}
export default ErrorHandlingMiddleWare