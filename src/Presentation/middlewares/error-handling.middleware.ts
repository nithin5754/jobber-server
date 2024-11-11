import { NextFunction, Request, Response } from "express"
import { CustomError, IErrorResponse } from "../error/error.interface"



const ErrorHandlingMiddleWare = (
  error:IErrorResponse,
  _req:Request,
  res:Response,
  next:NextFunction

):void=> {

  if (error instanceof CustomError) {
    console.log('error templete', ` ${error.comingFrom}:`, error);
    res.status(error.statusCode).json(error.serializeErrors());
  }
  next()

}
export default ErrorHandlingMiddleWare