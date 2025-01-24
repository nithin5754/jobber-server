import { Request, Response, NextFunction } from "express";

import { GigSeedUsecases } from "../../../Application/UseCases/4-gig-usecase/seed.gig.usecase";







export class GigSeedController  {

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