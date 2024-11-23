import { User } from '../../../Domain/Entities/User';

import { UserRepository } from '../../../Infrastructure/databse/mongoose/Repositories/user.respository';
import { BadRequestError } from '../../../Presentation/error/error.interface';
import { IRepoResponse } from '../../../shared/ibase-repository';
import { IUseCase } from '../../../shared/iusecase';

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
