import { Request, Response, NextFunction } from "express";

import { ISellerSeedResult, SeedSellersUsecase } from "../../../UseCases/3-seller-usecase/seed.seller.usecase";
import { BadRequestError } from "../../Error/errorInterface";
import { StatusCodes } from "http-status-codes";



export class SeedSeller {
  constructor(
    private readonly seedUsecase:SeedSellersUsecase
  ) {
    
  }
  public async handle(req: Request, res: Response, next: NextFunction): Promise<void> {

   try {
    const count:number=parseInt(`${req.params.count??0}`)

    if(!count){
      throw new BadRequestError('Missing', 'SeedSellersController seller() method error');
    }

    const result: ISellerSeedResult = await this.seedUsecase.execute({size:count});

    if(!result||!result.iSucess){
      throw new BadRequestError('Missing', 'SeedSellersController seller() method error');
    }


    res.status(StatusCodes.OK).json({ message:'Successfully Created test Sellers' });
   } catch (error) {
    next(error)
   }


  }
}