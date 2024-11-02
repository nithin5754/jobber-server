import { Document } from "mongoose";


/**
 * Interface representing a User.
 * In Frontend React JS IAuthDocument interface is similar exclude [ otp and otp expiration]
 * @interface IUser
 * 
 */
export interface IUser {
  id?:string;
  profilePublicId?: string;
  username?: string;
  email?: string;
  password?: string;
  country?: string;
  profilePicture?: string;
  emailVerified?: boolean;
  emailVerificationToken?: string;
  browserName?: string;
  deviceType?: string;
  otp?: string;
  otpExpiration?: string;
  createdAt?: string;
  updatedAt?: string;
  passwordResetToken?: string;
  passwordResetExpires?: string;
}








