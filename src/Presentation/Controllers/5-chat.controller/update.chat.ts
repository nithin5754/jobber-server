import { Request, Response, NextFunction } from 'express';
import { IController } from '../../../Shared/IController';

import { StatusCodes } from 'http-status-codes';

import { IUpdateOfferResult, UpdateOfferReadUsecase } from '../../../Application/UseCases/6-chat.usecase/update.offer.usecase';
import { BadRequestError } from '../../Error/error.interface';

export class UpdateOfferMessages implements IController {
  constructor(private readonly update: UpdateOfferReadUsecase) {}
  public async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { messageId, type } = req.body;

      if (!messageId || !type) {
        throw new BadRequestError('Not Found, Something Went Wrong', 'UpdateOfferMessages() Missing');
      }

      const message: IUpdateOfferResult = await this.update.execute({ messageId, type });
      res.status(StatusCodes.OK).json({ message: 'Message updated', singleMessage: message });
    } catch (error) {
      next(error);
    }
  }
}
