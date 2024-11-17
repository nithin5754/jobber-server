import { Request, Response, NextFunction } from 'express';
import { IController } from '../../../shared/IController';
import { StatusCodes } from 'http-status-codes';
import { IResendDTO, IResendResult, ResendUsecase } from '../../../Application/use-cases/1-auth-usecase/resend.usecase';
import { BadRequestError } from '../../error/error.interface';

export class Resend implements IController {
  constructor(private readonly resendUsecase: ResendUsecase) {}
  public async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;

      const userId = req.currentUser.userId;

      if (!userId || !email) {
        throw new BadRequestError('Credentials not found.Error', 'ResendEmail() error Credentials');
      }
      const data: IResendDTO = {
        email,
        userId
      };

      const result: IResendResult = await this.resendUsecase.execute(data);

      if (result.isSend === false) {
        throw new BadRequestError('Credentials not found.Error', 'ResendEmail() error Credentials');
      }

      res.status(StatusCodes.OK).json({ message: 'Resend Email Successfully Send' });
    } catch (error) {
      next(error);
    }
  }
}
