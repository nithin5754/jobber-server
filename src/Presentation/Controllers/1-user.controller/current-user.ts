import { Request, Response, NextFunction } from 'express';

import { BadRequestError } from '../../Error/errorInterface';

import { User } from '../../../Entities/User';
import { UserTypeKey } from '../../../Interface/IUser.interface';
import { omit } from 'lodash';
import { StatusCodes } from 'http-status-codes';

import { IController } from '../../../IController';
import { CurrentUserUsecase, ICurrentUserResult } from '../../../UseCases/1-auth-usecase/currentUser.usecase';

export class CurrentUser implements IController {
  constructor(private readonly currentUsecase: CurrentUserUsecase) {}
  public async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.validateRequest(req);

      const userId: string = req.currentUser.userId;

      const result: ICurrentUserResult = await this.currentUsecase.execute({ userId });

      if (!result) {
        throw new BadRequestError('Current User Credentials missing please login ', 'CurrentUser() method  error');
      }

      res
        .status(StatusCodes.OK)
        .json({
          message: 'user successfully authorized',
          user: this.sanitizeTheData(result.user, [
            'password',
            'emailVerificationToken',
            'browserName',
            'deviceType',
            'otp',
            'otpExpiration',
            'updatedAt',
            'passwordResetExpires',
            'passwordResetToken'
          ])
        });
    } catch (error) {
      next(error);
    }
  }

  private async validateRequest(req: Request): Promise<void> {
    if (!req.currentUser.userId) {
      throw new BadRequestError('Current User Credentials missing please login ', 'CurrentUser() method  error');
    }
  }

  private sanitizeTheData(data: User, RemoveItem: UserTypeKey[]): User {
    return omit(data, RemoveItem) as User;
  }
}
