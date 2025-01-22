import { Request, Response, NextFunction } from "express";
import { IController } from "../../../Shared/IController";
import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../../Error/error.interface";
import { DeleteGigUsecase } from "../../../Application/UseCases/4-gig-usecase/delete.gig.usecase";



export class DeleteGig implements IController {
  constructor(
    private readonly deleteGigUsecase:DeleteGigUsecase
  ) {
    
  }
 public async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
  
      const {gigId,sellerId}=req.params 

      if(!gigId||!sellerId){
        throw new BadRequestError('GigId and SellerId is required', 'Delete Controller() Missing');

      }


         await this.deleteGigUsecase.execute({gigId,sellerId})


     



      res.status(StatusCodes.OK).json({ message: 'Gig deleted successfully.' })
    } catch (error) {
      next(error)
    }
  }
}