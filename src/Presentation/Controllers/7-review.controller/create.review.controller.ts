import { NextFunction, Request, Response } from 'express';
import { CreateReviewUsecase, IReviewCreateResult } from '../../../UseCases/8-review-usecase/create.review.usecase';
import { StatusCodes } from 'http-status-codes';

import { IReview } from '../../../Interface/IReview.interface';
import { BadRequestError } from '../../Error/errorInterface';

export class CreateReviewController {
  constructor(private readonly createReview: CreateReviewUsecase) {}

  public async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const reviewData: IReview = {
        gigId: `${req.body?.gigId}`,
        reviewerId: `${req.body.reviewerId}`,
        sellerId: `${req.body.sellerId}`,
        reviewerImage: req.body.reviewerImage,
        review: req.body.review,
        rating: req.body.rating,
        orderId: req.body.orderId,
        reviewType: req.body.reviewType,
        reviewerUsername: req.body.reviewerUsername,
        country: req.body.country
      };



      const result: IReviewCreateResult = await this.createReview.execute({ reviewData });

      if (!result || !result.data) {
        throw new BadRequestError('Error : Create order ', 'Create order() method');
      }

      res.status(StatusCodes.CREATED).json({ message: 'review created successfully.', review:reviewData});
    } catch (error) {
      next(error);
    }
  }
}
