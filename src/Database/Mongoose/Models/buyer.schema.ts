import mongoose, { Model } from 'mongoose';
import { IBuyerDocument } from '../../../Entities/Buyer';


const BuyerSchema = new mongoose.Schema(
{
   
    userId:
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
    
    isSeller: { type: Boolean, default: false },
    purchasedGigs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gig'
      }
    ],
    createdAt: {
      type: Date,
      default: Date.now
    },

    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    versionKey: false
  }
);

BuyerSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export const BuyerModal:Model<IBuyerDocument> = mongoose.model<IBuyerDocument>('Buyer', BuyerSchema);
