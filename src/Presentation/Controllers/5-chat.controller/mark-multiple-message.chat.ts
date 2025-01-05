




import { NextFunction,Request,Response } from "express";
import { BadRequestError } from "../../error/error.interface";
import { StatusCodes } from "http-status-codes";
import { IController } from "../../../shared/icontroller";
import {  MarkMultipleMessageAsReadUsecase } from "../../../Application/use-cases/6-chat.usecase/mark-multiple.message.usecase";



export class MarkMultipleMessage implements IController {
  constructor(
    private readonly update:MarkMultipleMessageAsReadUsecase
  ) {
    
  }
 public async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { messageId, senderUsername, receiverUsername } = req.body;



      if (!messageId||!senderUsername|| !receiverUsername) {
        throw new BadRequestError('data not found', 'MarkMultipleMessage() Controller ');
      }


await this.update.execute({messageId,senderUsername,receiverUsername});

      res.status(StatusCodes.OK).json({  message: 'Message marked as read'});

    } catch (error) {
      next(error);
    }
  }



}