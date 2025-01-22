import { genSalt, hash } from "bcryptjs";
import mongoose, { Model } from "mongoose";
import { UserDocuments } from "../../../../Domain/Interface/IUser.interface";





const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePublicId: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    country: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      required: true,
    },
    emailVerificationToken: {
      type: String,
      default:''
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    browserName: {
      type: String,
      default:''
  
    },
    deviceType: {
      type: String,
      default:''

    },
    otp: {
      type: String,
      default:''
    },
    otpExpiration: {
      type: Date,
      default: Date.now,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    passwordResetToken: {
      type: String,
      default:''
    },
    passwordResetExpires: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  const salt = await genSalt();
  this.password = await hash(this.password , salt);
  next();
});

UserSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

UserSchema.set("toJSON", {
  transform: function (_doc, ret) {
    delete ret.password;
    delete ret.__v;
  },
});

export const UserModal:Model<UserDocuments> = mongoose.model<UserDocuments>("User", UserSchema);
