import { Request, Response, NextFunction } from "express";
import { IController } from "../../../shared/IController";
import { BadRequestError } from "../../error/error.interface";
import { GetBuyerUsecase, IGetBuyerResult } from "../../../Application/use-cases/2-buyer-usecase/get-buyer.usecase";
import { StatusCodes } from "http-status-codes";



export class GetBuyerByUsername implements IController {

    constructor(
      private readonly getBuyerUsecase:GetBuyerUsecase
    ){

    }

public async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
      
     const {username}=req.params

     if(!username){
      throw new BadRequestError('no buyer found', 'GetBuyerByUsername () method error');
     }


     const result:IGetBuyerResult=await this.getBuyerUsecase.execute({username})
   

     if(!result.buyer){
      throw new BadRequestError('no buyer found', 'GetBuyerByUsername () method error');

     }

     res.status(StatusCodes.OK).json({ message: 'Buyer profile', buyer:result.buyer });


       
  }
  
}