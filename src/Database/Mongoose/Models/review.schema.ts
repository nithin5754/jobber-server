import { model, Model, Schema } from 'mongoose';
import { IReviewDocument } from '../../../Interface/IReview.interface';

const reviewSchema: Schema = new Schema(
  {
    gigId: { type: Schema.Types.ObjectId, ref: 'Gig', required: true },
    reviewerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sellerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    review: { type: String, required: true },
    reviewerImage: { type: String, default: '' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    orderId: { type: String, required: true },
    reviewerUsername: { type: String, required: true },
    country: { type: String, required: true },
    reviewType: { type: String, enum: ['seller-review', 'buyer-review'], required: true }
  },
  { timestamps: true }
);

const ReviewModel: Model<IReviewDocument> = model<IReviewDocument>('Review', reviewSchema, 'Review');
export { ReviewModel };
