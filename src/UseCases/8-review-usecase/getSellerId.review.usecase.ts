

import {
  convertReviewArray,

  getReviewsBySellerId
} from '../../Database/Mongoose/Repositories/review.repository';
import { Review } from '../../Entities/Review';
import { IRepoResponse } from '../../IBaseRepositories';
import { BadRequestError } from '../../Presentation/Error/errorInterface';

export interface IReviewGetBySellerIdDTO {
  sellerId: string;
}

export interface IReviewGetByGigIResult {
  data: Review[];
}

export class GetBySellerIdReviewUsecase {
  constructor() {}

  public async execute(input: IReviewGetBySellerIdDTO): Promise<IReviewGetByGigIResult> {
    const result: IRepoResponse = await getReviewsBySellerId(input.sellerId);

    if (!result || !result.reviews || !result.reviews.length || result.reviews.length <=0) {
      throw new BadRequestError('Error', 'GetBySellerIdReviewUsecase() Not Found ');
    }

    return {
      data: convertReviewArray(result.reviews)
    };
  }
}
