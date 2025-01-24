import { Request, Response, NextFunction } from 'express';

import { BadRequestError } from '../../Error/errorInterface';
import Joi from 'joi';

import { StatusCodes } from 'http-status-codes';
import { IResetPasswordDTO, IResetPasswordResult, ResetPasswordUsecase } from '../../../UseCases/1AuthUsecase/reset-password.usecase';

export class ResetPassword  {
  constructor(private readonly validation: Joi.ObjectSchema<any>, private readonly resetForgotUsecase: ResetPasswordUsecase) {}
  public async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.validationRequest(req);

      const { password, confirmPassword } = req.body;

      const { token } = req.params;

      const data: IResetPasswordDTO = {
        confirmPassword,
        password,
        token
      };

      const result: IResetPasswordResult = await this.resetForgotUsecase.execute(data);

      if (!result.isUpdate) {
        throw new BadRequestError('Reset token has expired', 'Password resetPassword() method error');
      }

      res.status(StatusCodes.OK).json({ message: ' Password Reset Successfully' });
    } catch (error) {
      next(error);
    }
  }

  private async validationRequest(req: Request) {
    const { error } = (await Promise.resolve(this.validation)).validate(req.body);

    if (error) {
      throw new BadRequestError(error.details[0].message, 'Password resetPassword() method error');
    }
  }
}
