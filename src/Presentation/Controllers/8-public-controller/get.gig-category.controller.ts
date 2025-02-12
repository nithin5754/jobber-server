import { NextFunction, Request, Response } from 'express';
import { GetByCategorySellerGig, ISellerGigGetByCategoryResult } from '../../../UseCases/4-gig-usecase/get-category.gig.usecase';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from '../../Error/errorInterface';
import { ISellerGig } from '../../../Interface/IGig.interface';

export class PublicGigsByCategory {
  constructor(private readonly getGigByCategory: GetByCategorySellerGig) {}

  public async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
     console.log("req.params.category ",req.params.category )
      if (!req.params.category) {
        throw new BadRequestError('Error: Credentials Missing', 'PublicGigsByCategory() Missing');
      }

      if(req.params.category==='PhotoGraphy'){
        req.params.category=' Photography'
      }

      const result: ISellerGigGetByCategoryResult = await this.getGigByCategory.execute({ category: req.params.category });

     let gigArray:ISellerGig[]= result.gigs.slice(0,3)

      res
        .status(StatusCodes.OK)
        .json({ message: 'Public Index gigs category results', gigArray: result && result.gigs && result.gigs.length > 0 ? gigArray : [] });
    } catch (error) {
      next(error);
    }
  }
}
