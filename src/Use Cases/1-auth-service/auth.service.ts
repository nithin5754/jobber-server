import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { IUser } from '../../Entities/User';
import { ICrypto } from '../../External-libraries/1-crypto/ICrypto';
import { IUuid } from '../../External-libraries/2-public-id/IUuid';
import { ICloudinary } from '../../External-libraries/3-cloudinary/ICloudinary';
import { IToken } from '../../External-libraries/6-token.ts/IToken.interface';
import { IAuthRepository } from '../../Interfaces/IAuthRepository';
import { IAuthService } from '../../Interfaces/IAuthService';
import { IMailer, IEmailMessageDetails } from '../../External-libraries/4-mailer/interface/IMailer';
import { IMulterConverter } from '../../External-libraries/5-multer-converter/IMulterConverter';
import { firstLetterUpperCase, lowerCase } from '../../Presentation/utils/helper.utils';

export class AuthService implements IAuthService {
  constructor(
    private authRepo: IAuthRepository,
    private tokenRepo: IToken,
    private CryptoRepo: ICrypto,
    private uuid: IUuid,
    private cloudinary: ICloudinary,
    private mailer: IMailer,
    private fileConverter: IMulterConverter
  ) {}
  getUpdateNewPassword(id: string, password: string): Promise<boolean> {
   return this.authRepo.updateNewPassword(id,password)
  }
  getUserByPasswordVerification(token: string): Promise<IUser | undefined> {
    return this.authRepo.authUserByPasswordVerification(token);
  }
  getUpdatePasswordToken(authId: string, token: string, tokenExpiration: Date): Promise<void> {
    return this.authRepo.updatePasswordToken(authId, token, tokenExpiration);
  }
  getFetchDataById(userId: string): Promise<IUser | undefined> {
    return this.authRepo.fetchDataById(userId);
  }
  getUpdateVerifyEmailField(id: string, data: boolean): Promise<void> {
    return this.authRepo.updateVerifyEmailField(id, data);
  }
  async getAuthUserByVerificationToken(token: string): Promise<IUser | undefined> {
    return this.authRepo.authUserByEmailVerification(token);
  }
  fetchUserDetails(data: string, type: 'username' | 'email'): Promise<IUser | undefined> {
    if (type === 'username') {
      let username: string = firstLetterUpperCase(data);
      return this.authRepo.fetchDataByUsername(username);
    } else if (type === 'email') {
      let email: string = lowerCase(data);
      return this.authRepo.fetchDataByEmail(email);
    }

    return Promise.resolve(undefined);
  }
  convertFileToString(file: Express.Multer.File): string {
    return this.fileConverter.convertFileToString(file);
  }
  SendEmail(data: IEmailMessageDetails) {
    return this.mailer.SendEmail(data);
  }
  uploadsPhotos(
    file: string,
    public_id?: string,
    overWrite?: boolean,
    invalidate?: boolean
  ): Promise<UploadApiResponse | UploadApiErrorResponse | undefined> {
    return this.cloudinary.uploads(file, public_id, overWrite, invalidate);
  }
  createUuid(): string {
    return this.uuid.createUuid();
  }
  createRandomBytes(): Promise<Buffer> {
    return this.CryptoRepo.createRandomBytes();
  }
  signToken(userId: string, email: string, username: string): { accessToken: string; refreshToken: string } {
    return this.tokenRepo.generateToken(userId, email, username);
  }
  verify_token_short_period(token: string) {
    return this.tokenRepo.verifyAccessToken(token);
  }
  verify_token_longer_period(token: string) {
    return this.tokenRepo.verifyRefreshToken(token);
  }
  signSingleToken(userId: string, email: string, username: string): string {
    return this.tokenRepo.accessTokenGenerator(userId, email, username);
  }
  async usernameOrEmail(email: string, username: string): Promise<{ email: boolean; username: boolean }> {
    return await this.authRepo.getUserByUsernameOrEmail(email, username);
  }
  async create(data: IUser): Promise<IUser | undefined> {
    return await this.authRepo.createAuthUser(data);
  }
}
