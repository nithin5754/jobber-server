import { IReviewDocument } from "../Interface/IReview.interface";




export class Review {
  id: string;
  gigId: string;
  reviewerId: string;
  sellerId: string;
  review: string;
  reviewerImage: string;
  rating: number;
  orderId: string;
  createdAt: Date | string;
  reviewerUsername: string;
  country: string;
  reviewType?: string;

  constructor(params: IReviewDocument) {
    this.id = params._id?.toString() as string
    this.gigId = params.gigId;
    this.reviewerId = params.reviewerId;
    this.sellerId = params.sellerId;
    this.review = params.review;
    this.reviewerImage = params.reviewerImage;
    this.rating = params.rating;
    this.orderId = params.orderId;
    this.createdAt = params.createdAt;
    this.reviewerUsername = params.reviewerUsername;
    this.country = params.country;
    this.reviewType = params.reviewType;
  }
}
