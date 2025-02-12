


import { NextFunction, Request, Response } from "express";
import { GetByGigIdReviewUsecase } from "../../../UseCases/8-review-usecase/getByGigId.review.usecase";

import { StatusCodes } from "http-status-codes";
import { GetBySellerIdReviewUsecase, IReviewGetByGigIResult } from "../../../UseCases/8-review-usecase/getSellerId.review.usecase";
import { BadRequestError } from "../../Error/errorInterface";





export class  GetSellerIdReviewController {
  constructor(private readonly getSellerIdReview: GetBySellerIdReviewUsecase) {}

  public async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    

try {


  if(!req.params.sellerId){
          throw new BadRequestError('Error gigId missing', 'GetGigIdReviewController() Not Found ');
    
  }

  const result: IReviewGetByGigIResult = await this.getSellerIdReview.execute({sellerId:req.params.sellerId});

 if(!result||!result.data||!result.data.length||result.data.length<=0){
  throw new BadRequestError('Error :empty reviews', 'GetSellerIdReviewController() Not Found reviews');
 }

  res.status(StatusCodes.OK).json({ message: 'seller reviews by seller-id', reviews:result.data });
  
} catch (error) {
  next(error)
}

  }



}