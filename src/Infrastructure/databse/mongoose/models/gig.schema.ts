import mongoose, { Model, Schema, model } from 'mongoose';
import { SellerGigDocument } from '../../../../Domain/interface/igig.interface';

const gigSchema: Schema = new Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  basicTitle: { type: String, required: true },
  basicDescription: { type: String, required: true },
  categories: { type: String, required: true },
  subCategories: [{ type: String, required: true }],
  tags: [{ type: String }],
  active: { type: Boolean, default: true },
  expectedDelivery: { type: String, default: '' },
  ratingsCount: { type: Number, default: 0 },
  ratingSum: { type: Number, default: 0 },
  ratingCategories: {
    five: { value: { type: Number, default: 0 }, count: { type: Number, default: 0 } },
    four: { value: { type: Number, default: 0 }, count: { type: Number, default: 0 } },
    three: { value: { type: Number, default: 0 }, count: { type: Number, default: 0 } },
    two: { value: { type: Number, default: 0 }, count: { type: Number, default: 0 } },
    one: { value: { type: Number, default: 0 }, count: { type: Number, default: 0 } }
  },
  price: { type: Number, default: 0 },
  sortId: { type: Number },
  coverImage: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const GigModel: Model<SellerGigDocument> = model<SellerGigDocument>('Gig', gigSchema, 'Gig');
export { GigModel };
