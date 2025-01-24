import { ConfigType } from '../../../config';
import { User } from '../../../Domain/Entities/User';
import { UserRepository } from '../../../Infrastructure/Database/Mongoose/Repositories/UserRespository';
import { UniqueId } from '../../../Infrastructure/External-libraries/1-unique-id/unique-id.service';
import { IEmailMessageDetails } from '../../../Infrastructure/External-libraries/4-mailer/interface/imailer.interface';
import { Mailer } from '../../../Infrastructure/External-libraries/4-mailer/mailer.service';
import { BadRequestError } from '../../../Presentation/Error/errorInterface';
import { EMAIL_TEMPLATE, lowerCase } from '../../../Presentation/Utils/helper.utils';
import { IRepoResponse } from '../../../Shared/IBaseRepository';
import { IUseCase } from '../../../Shared/IUsecase';

export interface IResendDTO {
  email: string;
  userId: string;
}

export interface IResendResult {
  isSend: boolean;
}

export class ResendUsecase implements IUseCase<IResendDTO, IResendResult> {
  constructor(
    private readonly userservice: UserRepository,
    private readonly mailerService: Mailer,
    private readonly configService: ConfigType,
    private readonly uniqueIdService: UniqueId
  ) {}

  public async execute(input: IResendDTO): Promise<IResendResult> {
    const { email, userId } = input;
    let found: IRepoResponse = await this.userservice.findOne({ data: { email: lowerCase(email) } });
 

    if (!found || found.isNull || !found.user || found.user.id !== userId) {
      throw new BadRequestError('user not found', 'ResendEmail() error');
    }

    const randomCharacters: string = await this.generateRandomCharacters();

    return {
      isSend: !!(await Promise.all([
        this.userservice.update(found.user.id, { data: { emailVerificationToken: randomCharacters } }),

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
