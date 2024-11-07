import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { IUser } from '../Entities/User';
import { IEmailMessageDetails } from '../External-libraries/4-mailer/interface/IMailer';

export interface IAuthService {
  create(data: IUser): Promise<IUser | undefined>;
  usernameOrEmail(email: string, username: string): Promise<{ email: boolean; username: boolean }>;
  signToken(userId: string, email: string, username: string): { accessToken: string; refreshToken: string };
  signSingleToken(userId: string, email: string, username: string): string;
  verify_token_short_period(token: string): any;
  verify_token_longer_period(token: string): any;
  createRandomBytes(): Promise<Buffer>;
  createUuid(): string;
  SendEmail(data: IEmailMessageDetails): any;
  uploadsPhotos(
    file: string,
    public_id?: string,
    overWrite?: boolean,
    invalidate?: boolean
  ): Promise<UploadApiResponse | UploadApiErrorResponse | undefined>;
  convertFileToString(file: Express.Multer.File): string;

  getAuthUserByVerificationToken(token: string): Promise<IUser | undefined>;
  getUpdateVerifyEmailField(id: string, data: boolean): Promise<void>;

  fetchUserDetails(data: string, type: 'username' | 'email'): Promise<IUser | undefined>;

  getFetchDataById(userId: string): Promise<IUser | undefined>;

  getUpdatePasswordToken(authId: string, token: string, tokenExpiration: Date): Promise<void>;

  getUserByPasswordVerification(token: string): Promise<IUser | undefined>;

  getUpdateNewPassword(id: string, password: string): Promise<boolean>;
}
