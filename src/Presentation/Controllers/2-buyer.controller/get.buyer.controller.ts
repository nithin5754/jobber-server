import { Request, Response, NextFunction } from "express";
import { IController } from "../../../Shared/IController";
import { BadRequestError } from "../../error/error.interface";
import { GetBuyerUsecase, IGetBuyerDTO, IGetBuyerResult } from "../../../Application/use-cases/2-buyer-usecase/get-buyer.usecase";
import { StatusCodes } from "http-status-codes";



export class GetBuyerByEmail implements IController {

    constructor(
      private readonly getBuyerUsecase:GetBuyerUsecase
    ){

    }

public async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
      
     const email:string=req.currentUser.email

     if(!email){
      throw new BadRequestError('no buyer found', 'Get Buyer () method error');
     }


     const result:IGetBuyerResult=await this.getBuyerUsecase.execute({email})
   

     if(!result.buyer){
      throw new BadRequestError('no buyer found', 'Get Buyer () method error');

     }

     res.status(StatusCodes.OK).json({ message: 'Buyer profile', buyer:result.buyer });


       
  }
  
}