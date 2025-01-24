import { Request, Response, NextFunction } from "express";
import { IController } from "../../../Shared/IController";
import { BadRequestError } from "../../Error/errorInterface";
import { GetBuyerUsecase, IGetBuyerResult } from "../../../Application/UseCases/2-buyer-usecase/get-buyer.usecase";
import { StatusCodes } from "http-status-codes";



export class GetBuyerByUsername implements IController {

    constructor(
      private readonly getBuyerUsecase:GetBuyerUsecase
    ){

    }

public async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
try {
        
  const {username}=req.params

  if(!username){
   throw new BadRequestError('no buyer found', 'GetBuyerByUsername () method error');
  }


  const result:IGetBuyerResult=await this.getBuyerUsecase.execute({username})


  if(!result.buyer){
   throw new BadRequestError('no buyer found', 'GetBuyerByUsername () method error');

  }

  res.status(StatusCodes.OK).json({ message: 'Buyer profile', buyer:result.buyer });
  
} catch (error) {
  next(error)
}


       
  }
  
}