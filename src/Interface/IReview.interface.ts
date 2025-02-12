


export interface IReviewDocument {
  _id: string;
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
}


export interface IReview {
  _id?: string;
  id?:string;
  gigId?: string;
  reviewerId?: string;
  sellerId?: string;
  review?: string;
  reviewerImage?: string;
  rating?: number;
  orderId?: string;
  createdAt?: Date | string;
  reviewerUsername?: string;
  country?: string;
  reviewType?: string;
}



