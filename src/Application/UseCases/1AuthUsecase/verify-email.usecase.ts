import { User } from '../../../Domain/Entities/User';

import { UserRepository } from '../../../Infrastructure/Database/Mongoose/Repositories/UserRespository';
import { BadRequestError } from '../../../Presentation/Error/errorInterface';
import { IRepoResponse } from '../../../Shared/IBaseRepository';
import { IUseCase } from '../../../Shared/IUsecase';

export interface IVerifyEmailDTO {
  token: string;
}

export interface IVerifyEmailResult {
  user: User;
}

export class VerifyEmailUsecase implements IUseCase<IVerifyEmailDTO, IVerifyEmailResult> {
  constructor(private readonly userservice: UserRepository) {}
  public async execute(input: IVerifyEmailDTO): Promise<IVerifyEmailResult> {
    const { token } = input;

    const found: IRepoResponse = await this.userservice.findOne({ data: { emailVerificationToken: token } });

    if (!found || found.isNull || !found.user) {
      throw new BadRequestError('Verification token is either invalid or is already used.', 'VerifyEmail update() method error');
    }

    await this.userservice.update(found.user.id as string, {
      data: {
        emailVerified: true
      }
    });

    const updatedUser: IRepoResponse = await this.userservice.findOne({ data: { _id: found.user.id } });

    if (!updatedUser || !updatedUser.user || updatedUser.user?.emailVerified === false) {
      throw new BadRequestError('something went wrong .try again', 'VerifyEmail update() method error');
    }

    return {
      user: updatedUser.user
    };
  }
}
