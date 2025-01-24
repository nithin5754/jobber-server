import { ConfigType } from '../../../config';
import { User } from '../../../Domain/Entities/User';
import { IRepoResponse } from '../../../Domain/Interface/IUser.repository';
import { UserRepository } from '../../../Infrastructure/Database/Mongoose/Repositories/UserRespository';
import { UniqueId } from '../../../Infrastructure/External-libraries/1-unique-id/unique-id.service';
import { IEmailMessageDetails } from '../../../Infrastructure/External-libraries/4-mailer/interface/imailer.interface';
import { Mailer } from '../../../Infrastructure/External-libraries/4-mailer/mailer.service';
import { BadRequestError } from '../../../Presentation/Error/errorInterface';
import { EMAIL_TEMPLATE } from '../../../Presentation/Utils/helper.utils';
import { IUseCase } from '../../../Shared/IUsecases';


interface IForgotDTO {
  email: string;
}
export interface IForgotResult {
  isPassword: boolean;
}

export class ForgotPasswordUsecase implements IUseCase<IForgotDTO, IForgotResult> {
  constructor(
    private readonly userservice: UserRepository,
    private readonly configService: ConfigType,
    private readonly mailservice: Mailer,
    private readonly uniqueIdService: UniqueId
  ) {}
  public async execute(input: IForgotDTO): Promise<IForgotResult> {
    const { email } = input;

    let checkUserExist: IRepoResponse = await this.userservice.findOne({ data: { email } });

    if (!checkUserExist || checkUserExist.isNull || !checkUserExist.user) {
      throw new BadRequestError('Error .User not found', 'ForgotPassword forgotPassword() method error');
    }

    const randomCharacters = await this.generateRandomCharacters();

    const date: Date = new Date();
    date.setHours(date.getHours() + 1);

    return {
      isPassword: !!(await Promise.all([
        this.userservice.update(checkUserExist.user.id as string, {
          data: { passwordResetToken: randomCharacters, passwordResetExpires: date }
        }),
        this.sendVerificationEmail(checkUserExist.user, randomCharacters)
      ]))
    };
  }

  private async sendVerificationEmail(user: User, randomCharacters: string): Promise<void> {
    const emailDetails = this.createVerificationEmailDetails(user, EMAIL_TEMPLATE.EMAIL_FORGOT_PASSWORD, randomCharacters);
    await this.mailservice.SendEmail(emailDetails);
  }

  private createVerificationEmailDetails(data: User, template: string, randomCharacters: string): IEmailMessageDetails {
    const resetPasswordLink = `${this.configService.URL_.CLIENT_URL}/forgot-password?v_token=${randomCharacters}`;

    const messageDetails: IEmailMessageDetails = {
      template,
      receiver: data.email as string,
      locals: {
        appLink: `${this.configService.URL_.CLIENT_URL}`,
        appIcon: 'https://i.ibb.co/Kyp2m0t/cover.png',
        resetLink: resetPasswordLink,
        username: data.username as string
      }
    };


    

    return messageDetails;
  }

  private async generateRandomCharacters(): Promise<string> {
    const randomBytes: Buffer = await this.uniqueIdService.createRandomBytes();

    return randomBytes.toString('hex') as string;
  }
}
