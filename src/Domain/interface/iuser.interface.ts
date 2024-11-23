export type UserTypeKey=   
|'id'
|'profilePublicId'
|'username'
|'email'
|'password'
|'country'
|'profilePicture'
|'emailVerified'
|'emailVerificationToken'
|'browserName'
|'deviceType'
|'otp'
|'otpExpiration'
|'createdAt'
|'updatedAt'
|'passwordResetToken'
|'passwordResetExpires'


export interface UserDocuments {
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
  otpExpiration?: string;
  createdAt?: string;
  updatedAt?: string;
  passwordResetToken?: string;
  passwordResetExpires?: string;
}
