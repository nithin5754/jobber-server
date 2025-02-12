import mongoose from 'mongoose';
import { Review } from '../../../Entities/Review';
import { IRepoRequest, IRepoResponse } from '../../../IBaseRepositories';
import { IReviewDocument } from '../../../Interface/IReview.interface';
import { ReviewModel } from '../Models/review.schema';

export async function createReview(params: IRepoRequest): Promise<IRepoResponse> {
  const result: IReviewDocument = await ReviewModel.create(params.review);
  return {
    review: result
  };
}

export async function getReviewsByGigId(gigId: string): Promise<IRepoResponse> {
  const result: IReviewDocument[] = (await ReviewModel.aggregate([{ $match: { gigId: new mongoose.Types.ObjectId(gigId) } }])) as IReviewDocument[];

  return {
    reviews: result
  };
}

export async function getReviewsBySellerId(sellerId: string): Promise<IRepoResponse> {

  const result: IReviewDocument[] = (await ReviewModel.aggregate([{ $match: { sellerId: new mongoose.Types.ObjectId(sellerId), reviewType: 'seller-review'} }])) as IReviewDocument[];
  return {
    reviews: result
  };
}

export function convertReviewObj(params: IReviewDocument): Review {
  return new Review(params);
}

export function convertReviewArray(params: IReviewDocument[]): Review[] {
  let review: Review[] = [];

  for (let i = 0; i < params.length; i++) {
    review.push(new Review(params[i]));
  }

  return review;
}
