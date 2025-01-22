import { NextFunction,Request,Response } from "express";
import { BadRequestError } from "../../Error/error.interface";

import { StatusCodes } from "http-status-codes";
import { IController } from "../../../Shared/IController";
import { GetConversationUsecase, IGetConversationResult } from "../../../Application/UseCases/6-chat.usecase/get-conversation";



export class Conversation implements IController {
  constructor(
    private readonly getConversation:GetConversationUsecase
  ) {}
 public async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      
      const { senderUsername, receiverUsername } = req.params;
      
      if (!senderUsername||!receiverUsername) {
        throw new BadRequestError('data not found', 'Conversation() Controller ');
      }
      
      
      const found:IGetConversationResult = await this.getConversation.execute({receiver:receiverUsername,sender:senderUsername});
      
      if (!found || !found.conversations) {
        throw new BadRequestError('Missing Content', 'Conversation() Controller');
      }
      res.status(StatusCodes.OK).json({ message: 'Chat conversation and all messages', conversations:found.conversations });

    } catch (error) {
      next(error);
    }
  }



}