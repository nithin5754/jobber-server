import { Request, Response, NextFunction } from "express";
import { IController } from "../../../Shared/IController";
import { GetSellerUsecase, ISellerGetResult } from "../../../Application/UseCases/3-seller-usecase/get.seller.usecase";
import { BadRequestError } from "../../Error/errorInterface";
import { StatusCodes } from "http-status-codes";



export class SellerId implements IController {
  constructor(private readonly getsellerUserCase:GetSellerUsecase) {
    
  }
public async  handle(req: Request, res: Response, next: NextFunction): Promise<void> {
try {
  const sellerId=req.params.sellerId

  if(!sellerId|| typeof sellerId !== 'string'){
   throw new BadRequestError('Missing Content', 'SellerId() Missing');

  }
  
  const seller:ISellerGetResult=await this.getsellerUserCase.execute({_id:sellerId})

  if(!seller||!seller.seller){
   throw new BadRequestError('NotFound', 'SellerId() Missing');
  }

  res.status(StatusCodes.OK).json({message:'successfully find',seller:seller.seller})
  
} catch (error) {
  next(error)
}

  }
}