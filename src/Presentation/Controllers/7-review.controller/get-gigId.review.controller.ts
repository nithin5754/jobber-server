import { NextFunction, Request, Response } from "express";
import { GetByGigIdReviewUsecase } from "../../../UseCases/8-review-usecase/getByGigId.review.usecase";

import { StatusCodes } from "http-status-codes";
import { IReviewGetByGigIResult } from "../../../UseCases/8-review-usecase/getSellerId.review.usecase";
import { BadRequestError } from "../../Error/errorInterface";





export class  GetGigIdReviewController {
  constructor(private readonly getGigIdReview: GetByGigIdReviewUsecase) {}

  public async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    console.log("gigId",req.params.gigId,"ID",)

try {


  if(!req.params.gigId){
          throw new BadRequestError('Error gigId missing', 'GetGigIdReviewController() Not Found ');
    
  }

  const result: IReviewGetByGigIResult = await this.getGigIdReview.execute({gigId:req.params.gigId});

 if(!result||!result.data||!result.data.length||result.data.length<=0){
  throw new BadRequestError('Error :empty reviews', 'GetGigIdReviewController() Not Found reviews');
 }

  res.status(StatusCodes.OK).json({ message: 'Gig reviews by gig id', reviews:result.data });
  
} catch (error) {
  next(error)
}

  }



}