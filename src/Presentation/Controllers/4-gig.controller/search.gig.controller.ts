import { NextFunction, Request, Response } from 'express';

import { BadRequestError } from '../../Error/errorInterface';
import { SearchGigsUsecase, ISellerGigSearchIdResult } from '../../../UseCases/5-search-usecase/search.gig.usecase';

export class GigSearchController  {
  private readonly ITEM_PER_PAGE='8';

  constructor(private readonly gig_search_usecase: SearchGigsUsecase) {}
  public async handle(req: Request, res: Response, next: NextFunction): Promise<void> {

    try {
      const { query, minprice, maxprice, delivery_time } = req.query;
      let {  page} = req.params;
console.log("query",query)

      if (!query) {
        throw new BadRequestError('Missing, Using Search Query', 'SearchGigsUsecase Controller() Error');
      }

      

      const data: ISellerGigSearchIdResult = await this.gig_search_usecase.execute({ query: `${query}`,max_price:maxprice as string,min_price:minprice as string,delivery_time :delivery_time as string ,ITEM_PER_PAGE:this.ITEM_PER_PAGE ,page});

      res.status(200).json({
        message: 'successfully search items',
        gigArray: data.gigArray,
        totalGigLength:data.totalGigLength
      });
    } catch (error) {
      next(error);
    }
  }
}
