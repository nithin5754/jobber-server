import { Request, Response, NextFunction } from 'express';

import { LoginUseCase } from '../../../Application/UseCases/1AuthUsecase/login.usecase';
import Joi from 'joi';
import { BadRequestError } from '../../Error/error.interface';
import { omit } from 'lodash';
import { UserTypeKey } from '../../../Domain/Interface/IUser.interface';
import { User } from '../../../Domain/Entities/User';
import { StatusCodes } from 'http-status-codes';
import { IController } from '../../../Shared/IController';

export class Login implements IController {
  constructor(private readonly loginUseCase: LoginUseCase, private readonly validation: Joi.ObjectSchema<any>) {}
  public async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.validateRequest(req);

      /** @description username from req.body should contain either username or email */
      const { username, password } = req.body;

      const userData = await this.loginUseCase.execute({ userId: username, password });

      if (userData && userData.token && userData.user) {
        res.cookie("jwt", userData.token?.refreshToken, {
          httpOnly: true,
          secure: true,
          maxAge: 7 * 24 * 60 * 60 * 1000,
          sameSite: "none",
        });
        res.status(StatusCodes.OK).json({
          message: 'User login Successfully',
          user: this.sanitizeTheData(userData.user, ['password']),
          token: userData.token.accessToken
        });
      }
    } catch (error) {
      next(error);
    }
  }

  private async validateRequest(req: Request): Promise<void> {
    const { error } = (await Promise.resolve(this.validation)).validate(req.body);
    if (error?.details) {
      throw new BadRequestError(error.details[0].message, 'SignUp validation error');
    }
  }

  private sanitizeTheData(data: User, RemoveItem: UserTypeKey[]): User {
    return omit(data, RemoveItem) as User;
  }
}
