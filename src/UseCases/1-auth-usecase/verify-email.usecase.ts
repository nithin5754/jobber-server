import { findOneByUser, updateUser } from "../../Database/Mongoose/Repositories/UserRespository";
import { User } from "../../Entities/User";
import { IRepoResponse } from "../../IBaseRepositories";
import { BadRequestError } from "../../Presentation/Error/errorInterface";



export interface IVerifyEmailDTO {
  token: string;
}

export interface IVerifyEmailResult {
  user: User;
}

export class VerifyEmailUsecase  {
  public async execute(input: IVerifyEmailDTO): Promise<IVerifyEmailResult> {
    const { token } = input;

    const found: IRepoResponse = await findOneByUser({ data: { emailVerificationToken: token } });

    if (!found || found.isNull || !found.user) {
      throw new BadRequestError('Verification token is either invalid or is already used.', 'VerifyEmail update() method error');
    }

    await updateUser(found.user.id as string, {
      data: {
        emailVerified: true
      }
    });

    const result: IRepoResponse = await findOneByUser({ data: { _id: found.user.id } });

    if (!result || !result.user || result.user?.emailVerified === false) {
      throw new BadRequestError('something went wrong .try again', 'VerifyEmail update() method error');
    }

    return {
      user: result.user
    };
  }
}
