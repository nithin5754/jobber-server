import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { ConfigType } from '../../../config';
import { User } from '../../../Domain/Entities/User';

import { BadRequestError } from '../../../Presentation/error/error.interface';
import { EMAIL_TEMPLATE } from '../../../Presentation/utils/helper.utils';
import { IUseCase } from '../../../Shared/IUsecase';
import { UserRepository } from '../../../Infrastructure/databse/mongoose/Repositories/user.respository';
import { UniqueId } from '../../../Infrastructure/External-libraries/1-unique-id/unique-id.service';
import { Mailer } from '../../../Infrastructure/External-libraries/4-mailer/mailer.service';
import { MulterFileConverter } from '../../../Infrastructure/External-libraries/5-multer-converter/multer-convertor.service';
import { CloudinaryUploads } from '../../../Infrastructure/External-libraries/3-cloudinary/cloudinary-uploads.service';
import { JwtToken } from '../../../Infrastructure/External-libraries/6-token.ts/token.service';
import { IEmailMessageDetails } from '../../../Infrastructure/External-libraries/4-mailer/interface/imailer.interface';

export interface ICreateUserDTO {
  username: string;
  email: string;
  password: string;
  profilePicture: Express.Multer.File;
  country: string;
}

export interface ICreateUserResult {
  user?: User;
  userArray?: User;
  token?: {
    accessToken?: string;
    refreshToken?: string;
  };
}

export class RegisterUseCase implements IUseCase<ICreateUserDTO, ICreateUserResult> {
  constructor(
    private readonly userService: UserRepository,
    private readonly mailerService: Mailer,
    private readonly configService: ConfigType,
    private readonly uniqueIdService: UniqueId,
    private readonly multerService: MulterFileConverter,
    private readonly cloudinaryService: CloudinaryUploads,
    private readonly authService: JwtToken
  ) {}

  public async execute(input: ICreateUserDTO): Promise<ICreateUserResult> {
    await this.validateUniqueUser(input.username, input.email);

    const result: User = await this.processUserCreation(input);

    if (!result) {
      throw new BadRequestError('Failed to create user', 'SignUp creation error');
    }

    await this.sendVerificationEmail(result);

    const { accessToken, refreshToken } = await this.generateTokens(result);

    if (!result || !accessToken || !refreshToken) {
      throw new BadRequestError('Failed to create user', 'SignUp creation error');
    }

    return {
      token: {
        accessToken,
        refreshToken
      },
      user: result
    };
  }

  private async processUserCreation(input: ICreateUserDTO): Promise<User> {
    const { username, email, password, country, profilePicture } = input;

    const [randomCharacters, { url, profilePublicId }] = await Promise.all([
      this.generateRandomCharacters(),
      this.uploadPhotoGetUrlAndId(profilePicture)
    ]);

    const newUserData = {
      username,
      email,
      password,
      country,
      profilePicture: url,
      profilePublicId,
      emailVerificationToken: randomCharacters
    };

    const userData = await this.userService.create({ data: newUserData });

    if (!userData || userData.isNull || !userData.user) {
      throw new BadRequestError('Failed to create user', 'SignUp creation error');
    }

    return userData.user;
  }

  private async validateUniqueUser(username: string, email: string): Promise<void> {
    const existingUser = await this.userService.isUsernameOrEmailExist(email, username);

    if (existingUser.email && existingUser.username) {
      throw new BadRequestError('Username and email already exist', 'SignUp validation error');
    }
    if (existingUser.email) {
      throw new BadRequestError('Email already exists', 'SignUp validation error');
    }
    if (existingUser.username) {
      throw new BadRequestError('Username already exists', 'SignUp validation error');
    }
  }

  private async sendVerificationEmail(user: User): Promise<void> {
    const emailDetails = this.createVerificationEmailDetails(user, EMAIL_TEMPLATE.EMAIL_VERIFICATION);
    await this.mailerService.SendEmail(emailDetails);
  }

  private createVerificationEmailDetails(data: User, template: string): IEmailMessageDetails {
    const verificationLink = `${this.configService.URL_.CLIENT_URL}/confirm_email?v_token=${data.emailVerificationToken}`;

    const messageDetails: IEmailMessageDetails = {
      template,
      receiver: data.email as string,
      locals: {
        appLink: `${this.configService.URL_.CLIENT_URL}`,
        appIcon: 'https://i.ibb.co/Kyp2m0t/cover.png',
        verifyLink: verificationLink,
        username: data.username as string
      }
    };

    return messageDetails;
  }

  private async generateRandomCharacters(): Promise<string> {
    const randomBytes: Buffer = await this.uniqueIdService.createRandomBytes();

    return randomBytes.toString('hex') as string;
  }

  private async uploadPhotoGetUrlAndId(
    profilePicture: Express.Multer.File
  ): Promise<{ url?: string; profilePublicId?: string; error?: string }> {
    const profilePublicId: string = this.uniqueIdService.createUuid();
    if (!profilePublicId) {
      return { error: 'error creating profile public id' };
    }

    const dataURI: string = this.multerService.convertFileToString(profilePicture) as string;
    const uploadResult: UploadApiResponse = (await this.uploadsPhotos(dataURI, `${profilePublicId}`, true, true)) as UploadApiResponse;
    if (!uploadResult.public_id) {
      return { error: 'File upload error. Try again' };
    }

    return {
      url: uploadResult.public_id,
      profilePublicId
    };
  }

  private async uploadsPhotos(
    file: string,
    public_id?: string,
    overWrite?: boolean,
    invalidate?: boolean
  ): Promise<UploadApiResponse | UploadApiErrorResponse | undefined> {
    return this.cloudinaryService.uploads(file, public_id, overWrite, invalidate);
  }

  private async generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    const tokens = await this.authService.generateToken(user.id as string, user.email as string, user.username as string);

    if (!tokens.accessToken || !tokens.refreshToken) {
      throw new BadRequestError('Token generation failed', 'SignUp token error');
    }

    return tokens;
  }
}
