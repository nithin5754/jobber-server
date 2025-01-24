import { lowerCase } from "lodash";
import { ConfigType } from "../../config";
import { findOneByUser, updateUser } from "../../Database/Mongoose/Repositories/UserRespository";
import { User } from "../../Entities/User";
import { UniqueId } from "../../External-libraries/1-unique-id/unique-id.service";
import { IEmailMessageDetails } from "../../External-libraries/4-mailer/interface/imailer.interface";
import { Mailer } from "../../External-libraries/4-mailer/mailer.service";
import { IRepoResponse } from "../../IBaseRepositories";
import { BadRequestError } from "../../Presentation/Error/errorInterface";
import { EMAIL_TEMPLATE } from "../../utils/helper.utils";



export interface IResendDTO {
  email: string;
  userId: string;
}

export interface IResendResult {
  isSend: boolean;
}

export class ResendUsecase  {
  constructor(
    private readonly mailerService: Mailer,
    private readonly configService: ConfigType,
    private readonly uniqueIdService: UniqueId
  ) {}

  public async execute(input: IResendDTO): Promise<IResendResult> {
    const { email, userId } = input;
    let found: IRepoResponse = await findOneByUser({ data: { email: lowerCase(email) } });
 

    if (!found || found.isNull || !found.user || found.user.id !== userId) {
      throw new BadRequestError('user not found', 'ResendEmail() error');
    }

    const randomCharacters: string = await this.generateRandomCharacters();

    return {
      isSend: !!(await Promise.all([
        updateUser(found.user.id, { data: { emailVerificationToken: randomCharacters } }),

        this.sendVerificationEmail(found.user, randomCharacters)
      ]))
    };
  }

  private async sendVerificationEmail(user: User, randomCharacters: string): Promise<void> {
    const emailDetails = this.createVerificationEmailDetails(user, EMAIL_TEMPLATE.EMAIL_VERIFICATION, randomCharacters);
    await this.mailerService.SendEmail(emailDetails);
  }

  private createVerificationEmailDetails(data: User, template: string, randomCharacters: string): IEmailMessageDetails {
    const verificationLink = `${this.configService.URL_.CLIENT_URL}/confirm_email?v_token=${randomCharacters}`;

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
}
