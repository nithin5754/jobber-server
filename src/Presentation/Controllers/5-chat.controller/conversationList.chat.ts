



import { NextFunction,Request,Response } from "express";
import { BadRequestError } from "../../error/error.interface";

import { StatusCodes } from "http-status-codes";
import { IController } from "../../../shared/IController";
import { GetConversationUsecase, IGetConversationResult } from "../../../Application/use-cases/6-chat.usecase/get-conversation";
import { ConversationListUsecase, IConversationListResult } from "../../../Application/use-cases/6-chat.usecase/conversation-list.usecase";



export class ConversationList implements IController {
  constructor(
    private readonly conversationListUseCase:ConversationListUsecase
  ) {
    
  }
 public async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {


      const { username } = req.params;

      if (!username) {
        throw new BadRequestError('data not found', 'ConversationList() Controller ');
      }


      const found:IConversationListResult = await this.conversationListUseCase.execute({username});

      if (!found || !found.messages) {
        throw new BadRequestError('Missing Content', 'ConversationList() Controller');
      }
      res.status(StatusCodes.OK).json({ message: 'Conversation list', conversations: found.messages });
    } catch (error) {
      next(error);
    }
  }



}