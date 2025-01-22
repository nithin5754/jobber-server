import { UserRepository } from '../../../Infrastructure/Databse/Mongoose/Repositories/user.respository';
import { JwtToken } from '../../../Infrastructure/External-libraries/6-token.ts/token.service';
import { BadRequestError } from '../../../Presentation/Error/error.interface';
import { IRepoResponse } from '../../../Shared/IBaseRepository';
import { IUseCase } from '../../../Shared/IUsecase';

export interface IResetPasswordDTO {
  password: string;
  confirmPassword: string;
  token: string;
}

export interface IResetPasswordResult {
  isUpdate: boolean;
}

export class ResetPasswordUsecase implements IUseCase<IResetPasswordDTO, IResetPasswordResult> {
  constructor(private readonly userservice: UserRepository, private readonly authservice: JwtToken) {}
  public async execute(input: IResetPasswordDTO): Promise<IResetPasswordResult> {
    const { password, confirmPassword, token } = input;

    if (password !== confirmPassword) {
      throw new BadRequestError('Passwords do not match', 'Password resetPassword() method error');
    }

    const existingUser: IRepoResponse = await this.userservice.findOne({ data: { emailVerificationToken: token } });

    if (!existingUser || existingUser.isNull || !existingUser.user) {
      throw new BadRequestError('Reset token has expired', 'Password resetPassword() method error');
    }

    const hashedPassword: string = await this.authservice.hashing(password);

    const isUpdate: IRepoResponse = await this.userservice.update(existingUser.user.id as string, { data: { password: hashedPassword } });

    if (!isUpdate.isUpdate) {
      throw new BadRequestError('error while reset password', 'Password resetPassword() method error');
    }

    return {
      isUpdate: true
    };
  }
}
