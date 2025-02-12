import { Request, Response, NextFunction } from 'express';

import { BadRequestError } from '../../Error/errorInterface';
import { User } from '../../../Entities/User';
import { UserTypeKey } from '../../../Interface/IUser.interface';
import { omit } from 'lodash';
import { StatusCodes } from 'http-status-codes';
import { RefreshUsecase, IRefreshResult } from '../../../UseCases/1-auth-usecase/refresh.usecase';

export class Refresh {
  constructor(private readonly refreshUsecase: RefreshUsecase) {}
  public async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cookies = req.cookies;

      await this.validateRequest(req);

      const result: IRefreshResult = await this.refreshUsecase.execute({ token: cookies.jwt });

      if (!result || !result.user) {
        throw new BadRequestError('Invalid refresh token', 'OnRefreshToken() method Token error');
      }

      if (result && result.token && result.user) {
        res.status(StatusCodes.CREATED).json({
          message: 'created',
          user: this.sanitizeTheData(result.user, ['password']),
          token: result.token.accessToken
        });
      }
    } catch (error) {
      next(error);
    }
  }

  private async validateRequest(req: Request): Promise<void> {
    if (!req.cookies?.jwt) {
      throw new BadRequestError('Token expired please login again', 'OnRefreshToken() method Token error');
    }
  }

  private sanitizeTheData(data: User, RemoveItem: UserTypeKey[]): User {
    return omit(data, RemoveItem) as User;
  }
}
