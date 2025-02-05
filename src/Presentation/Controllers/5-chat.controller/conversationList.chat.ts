



import { NextFunction,Request,Response } from "express";
import { BadRequestError } from "../../Error/errorInterface";

import { StatusCodes } from "http-status-codes";
import { ConversationListUsecase, IConversationListResult } from "../../../UseCases/6-chat-usecase/conversation-list.usecase";





export class ConversationList  {
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