import {
  convertReviewArray,
  getReviewsByGigId
} from '../../Database/Mongoose/Repositories/review.repository';
import { Review } from '../../Entities/Review';
import { IRepoResponse } from '../../IBaseRepositories';
import { BadRequestError } from '../../Presentation/Error/errorInterface';

export interface IReviewGetByGigIdDTO {
  gigId: string;
}

export interface IReviewGetByGigIResult {
  data: Review[];
}

export class GetByGigIdReviewUsecase {
  constructor() {}

  public async execute(input: IReviewGetByGigIdDTO): Promise<IReviewGetByGigIResult> {
    const result: IRepoResponse = await getReviewsByGigId(input.gigId);

    if (!result || !result.reviews || !result.reviews.length || result.reviews.length <=0) {
      throw new BadRequestError('Error', 'GetByGigIdReviewUsecase() Not Found ');
    }



    return {
      data: convertReviewArray(result.reviews)
    };
  }
}
