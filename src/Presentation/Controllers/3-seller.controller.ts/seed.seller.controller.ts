import { Request, Response, NextFunction } from "express";
import { IController } from "../../../Shared/IController";
import { ISellerSeedResult, SeedSellersUsecase } from "../../../Application/use-cases/3-seller-usecase/seed.seller.usecase";
import { BadRequestError } from "../../error/error.interface";
import { StatusCodes } from "http-status-codes";



export class SeedSeller implements IController {
  constructor(
    private readonly seedUsecase:SeedSellersUsecase
  ) {
    
  }
  public async handle(req: Request, res: Response, next: NextFunction): Promise<void> {

    const count:number=parseInt(`${req.params.count??0}`)

    if(!count){
      throw new BadRequestError('Missing', 'SeedSellersController seller() method error');
    }

    const result: ISellerSeedResult = await this.seedUsecase.execute({size:count});

    if(!result||!result.iSucess){
      throw new BadRequestError('Missing', 'SeedSellersController seller() method error');
    }


    res.status(StatusCodes.OK).json({ message:'Successfully Created test Sellers' });


  }
}