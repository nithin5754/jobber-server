import moment from "moment";
import { firstLetterUpperCase, lowerCase } from "../Presentation/utils/helper.utils";



/**
 * Interface representing a User.
 * In Frontend React JS IAuthDocument interface is similar exclude [ otp and otp expiration]
 * @interface IUser
 * 
 */
export interface IUser {
  _id?:string;
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
  passwordResetExpires?:Date;
}



/**
 * @description Welcome to domain layer.
 * This is the user entity. For the sake of convenience, we are keeping it simple.
 */
export type UserParams = {
  _id?: string;
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
  otpExpiration?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
};





export class User {
  id?: string;
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

  constructor(userData: UserParams) {
    this.id = userData._id?.toString() as string;
    this.profilePublicId = userData.profilePublicId;
    this.username = firstLetterUpperCase(userData?.username as string);
    this.email = lowerCase(userData?.email as string);
    this.password = userData.password;
    this.country = userData.country;
    this.profilePicture = userData.profilePicture;
    this.emailVerified = userData.emailVerified;
    this.emailVerificationToken = userData.emailVerificationToken;
    this.browserName = userData.browserName;
    this.deviceType = userData.deviceType;
    this.otp = userData.otp;
    this.otpExpiration =moment(userData.otpExpiration).format('MMMM D, YYYY - h:mm A');
    this.createdAt =moment(userData.createdAt).format('MMMM D, YYYY - h:mm A');
    this.updatedAt =moment(userData.updatedAt).format('MMMM D, YYYY - h:mm A');
    this.passwordResetToken = userData.passwordResetToken
    this.passwordResetExpires = moment(userData.passwordResetExpires).format('MMMM D, YYYY - h:mm A');
  }
}






