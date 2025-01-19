import { Request, Response, NextFunction } from 'express';
import { IController } from '../../../shared/IController';
import { BadRequestError } from '../../error/error.interface';
import Joi from 'joi';
import { ForgotPasswordUsecase, IForgotResult } from '../../../Application/use-cases/1-auth-usecase/forgot-password.usecase';

import { StatusCodes } from 'http-status-codes';

export class ForgotPassword implements IController {
  constructor(private readonly validation: Joi.ObjectSchema<any>, private readonly forgotPasswordUsecase: ForgotPasswordUsecase) {}
  public async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.validateRequest(req);

      const { email } = req.body;

      const result: IForgotResult = await this.forgotPasswordUsecase.execute({ email });

      if (!result) {
        throw new BadRequestError('Error .User not found', 'ForgotPassword forgotPassword() method error');
      }

      res.status(StatusCodes.OK).json({ message: 'Password reset email sent.' });
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
}
