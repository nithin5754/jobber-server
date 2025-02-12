

import { convertReviewObj, createReview } from '../../Database/Mongoose/Repositories/review.repository';
import { Review } from '../../Entities/Review';
import { IRepoResponse } from '../../IBaseRepositories';
import { IReview } from '../../Interface/IReview.interface';
import { BadRequestError } from '../../Presentation/Error/errorInterface';

export interface IReviewCreateDTO {
  reviewData:IReview
}

export interface IReviewCreateResult {
  data: Review;
}

export class CreateReviewUsecase {
  constructor() {}

  public async execute(input: IReviewCreateDTO): Promise<IReviewCreateResult> {
 

    const result: IRepoResponse = await createReview({ review:input.reviewData });

    if (!result || !result.review) {
      throw new BadRequestError('Error', 'Create Review() Not Found ');
    }

    return {
      data:convertReviewObj(result.review)
    };
  }
}
