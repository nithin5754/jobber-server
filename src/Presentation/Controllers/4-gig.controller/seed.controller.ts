import { Request, Response, NextFunction } from "express";
import { IController } from "../../../Shared/IController";
import { GigSeedUsecases } from "../../../Application/use-cases/4-gig-usecase/seed.gig.usecase";







export class GigSeedController implements IController {

  constructor (private readonly seedUseCase:GigSeedUsecases){
    
  }

 public async handle(_req: Request, res: Response, next: NextFunction): Promise<void> {
      
       try {
               
     await this.seedUseCase.execute({})


     res.status(200).json({
      message: 'successfully gigs created',
    
    });
       } catch (error) {
        next(error)
       }
  }
  
}