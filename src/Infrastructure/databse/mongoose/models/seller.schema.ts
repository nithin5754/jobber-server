import mongoose, { Model, Schema, model } from 'mongoose';
import { ISellerDocument } from '../../../../Domain/interface/iseller.interface';

const sellerSchema: Schema = new Schema(
  {
    fullName: { type: String, required: true },
    userId:
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
    description: { type: String, default: '' },
    oneliner: { type: String, default: '' },
    languages: [
      {
        language: { type: String, required: true },
        level: { type: String, required: true }
      }
    ],
    skills: [{ type: String, required: true }],
    // ratingsCount: { type: Number, default: 0 },
    // ratingSum: { type: Number, default: 0 },
    // ratingCategories: {
    //   five: { value: { type: Number, default: 0 }, count: { type: Number, default: 0 } },
    //   four: { value: { type: Number, default: 0 }, count: { type: Number, default: 0 } },
    //   three: { value: { type: Number, default: 0 }, count: { type: Number, default: 0 } },
    //   two: { value: { type: Number, default: 0 }, count: { type: Number, default: 0 } },
    //   one: { value: { type: Number, default: 0 }, count: { type: Number, default: 0 } }
    // },
    responseTime: { type: Number, default: 0 },
    recentDelivery: { type: Date, default: '' },
    experience: [
      {
        company: { type: String, default: '' },
        title: { type: String, default: '' },
        startDate: { type: String, default: '' },
        endDate: { type: String, default: '' },
        description: { type: String, default: '' },
        currentlyWorkingHere: { type: Boolean, default: false }
      }
    ],
    education: [
      {
        country: { type: String, default: '' },
        university: { type: String, default: '' },
        title: { type: String, default: '' },
        major: { type: String, default: '' },
        year: { type: String, default: '' }
      }
    ],
    socialLinks: [{ type: String, default: '' }],
    certificates: [
      {
        name: { type: String },
        from: { type: String },
        year: { type: Number }
      }
    ],
    ongoingJobs: { type: Number, default: 0 },
    completedJobs: { type: Number, default: 0 },
    cancelledJobs: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    totalGigs: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
  },
  {
    versionKey: false
  }
);

const SellerModel: Model<ISellerDocument> = model<ISellerDocument>('Seller', sellerSchema, 'Seller');
export { SellerModel };
