import { NextFunction, Request, Response } from 'express';
import { BadRequestError } from '../../Error/error.interface';
import { StatusCodes } from 'http-status-codes';
import { IController } from '../../../Shared/IController';
import { MarkMessageAsReadUsecase } from '../../../Application/use-cases/6-chat.usecase/mark-single.message.usecase';

export class MarkSingleMessage implements IController {
  constructor(private readonly update: MarkMessageAsReadUsecase) {}
  public async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { messageId } = req.body;

      if (!messageId) {
        throw new BadRequestError('data not found', 'MarkSingleMessage() Controller ');
      }

      await this.update.execute({ id: messageId });

      res.status(StatusCodes.OK).json({ message: 'Message marked as read' });
    } catch (error) {
      next(error);
    }
  }
}
