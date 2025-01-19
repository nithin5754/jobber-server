import { Request, Response, NextFunction } from 'express';
import { IController } from '../../../shared/IController';
import { BadRequestError } from '../../error/error.interface';
import { IVerifyEmailResult, VerifyEmailUsecase } from '../../../Application/use-cases/1-auth-usecase/verify-email.usecase';
import { StatusCodes } from 'http-status-codes';
import { UserTypeKey } from '../../../Domain/interface/IUser.interface';
import { User } from '../../../Domain/Entities/User';
import { omit } from 'lodash';

export class VerifyEmail implements IController {
  constructor(private verifyEmailusecase: VerifyEmailUsecase) {}
  public async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token } = req.body;

      if (!token) {
        throw new BadRequestError('verification token error please try after sometime.', 'VerifyEmail update() method error');
      }

      const result: IVerifyEmailResult = await this.verifyEmailusecase.execute({ token });

      if (!result || !result.user) {
        throw new BadRequestError('something went wrong .try again', 'VerifyEmail update() method error');
      }
      res.status(StatusCodes.OK).json({
        message: 'Email verified successfully.',
        user: this.sanitizeTheData(result.user, ['password'])
      });
    } catch (error) {
      next(error);
    }
  }

  private sanitizeTheData(data: User, RemoveItem: UserTypeKey[]): User {
    return omit(data, RemoveItem) as User;
  }
}
