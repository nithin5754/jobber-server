import { ConfigType } from "../../config";
import { findOneByUser, updateUser } from "../../Database/Mongoose/Repositories/user.respository";
import { User } from "../../Entities/User";
import { UniqueId } from "../../External-libraries/1-unique-id/unique-id.service";
import { IEmailMessageDetails } from "../../External-libraries/4-mailer/interface/imailer.interface";
import { Mailer } from "../../External-libraries/4-mailer/mailer.service";
import { IRepoResponse } from "../../IBaseRepositories";
import { BadRequestError } from "../../Presentation/Error/errorInterface";
import { EMAIL_TEMPLATE } from "../../Presentation/utils/helper.utils";





interface IForgotDTO {
  email: string;
}
export interface IForgotResult {
  isPassword: boolean;
}

export class ForgotPasswordUsecase  {
  constructor(
    private readonly configService: ConfigType,
    private readonly mailservice: Mailer,
    private readonly uniqueIdService: UniqueId
  ) {}
  public async execute(input: IForgotDTO): Promise<IForgotResult> {
    const { email } = input;

    let checkUserExist: IRepoResponse = await findOneByUser({ data: { email } });

    if (!checkUserExist || checkUserExist.isNull || !checkUserExist.user) {
      throw new BadRequestError('Error .User not found', 'ForgotPassword forgotPassword() method error');
    }

    const randomCharacters = await this.generateRandomCharacters();

    const date: Date = new Date();
    date.setHours(date.getHours() + 1);

    return {
      isPassword: !!(await Promise.all([
        updateUser(checkUserExist.user.id as string, {
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
