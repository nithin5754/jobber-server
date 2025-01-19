import { Request, Response, NextFunction } from 'express';
import { IController } from '../../../shared/IController';
import { ICreateUserDTO, RegisterUseCase } from '../../../Application/use-cases/1-auth-usecase/register.usecase';
import { BadRequestError } from '../../error/error.interface';

import Joi from 'joi';
import { StatusCodes } from 'http-status-codes';
import { User } from '../../../Domain/Entities/User';
import { UserTypeKey } from '../../../Domain/interface/IUser.interface';
import {  omit } from 'lodash';
import { firstLetterUpperCase, lowerCase } from '../../utils/helper.utils';

export class RegisterController implements IController {
  constructor(private readonly registerUseCase: RegisterUseCase, private readonly validation: Joi.ObjectSchema<any>) {}
  public async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.validateRequest(req);

      const { username, email, password, country } = req.body;

      const profilePicture: Express.Multer.File | undefined = req.file;

      const newUserData: ICreateUserDTO = {
        username:firstLetterUpperCase(username),
        email:lowerCase(email),
        password,
        country,
        profilePicture: profilePicture as Express.Multer.File
      };

      const userData = await this.registerUseCase.execute(newUserData);

   

      if (userData && userData.token && userData.user) {
        res.cookie("jwt", userData.token?.refreshToken, {
          httpOnly: true,
          secure: true,
          maxAge: 7 * 24 * 60 * 60 * 1000,
          sameSite: "none",
        });

        res.status(StatusCodes.CREATED).json({
          message: 'created',
          user: this.sanitizeTheData(userData.user, ['password']),
          token: userData.token.accessToken
        });
      }
    } catch (error) {
      next(error);
    }
  }

  private async validateRequest(req: Request): Promise<void> {
    if (!req.file) {
      throw new BadRequestError('Profile picture is required', 'SignUp validation error');
    }

    const { error } = (await Promise.resolve(this.validation)).validate(req.body);
    if (error?.details) {
      throw new BadRequestError(error.details[0].message, 'SignUp validation error');
    }
  }

  private sanitizeTheData(data: User, RemoveItem: UserTypeKey[]): User {
    return omit(data, RemoveItem) as User;
  }
}
