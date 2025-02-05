


import { NextFunction,Request,Response } from "express";
import { BadRequestError } from "../../Error/errorInterface";

import { StatusCodes } from "http-status-codes";
import { IGetMessageResult } from "../../../UseCases/6-chat-usecase/get-message.usecase";
import { GetUserMessagesUsecase } from "../../../UseCases/6-chat-usecase/get-usermessages.uecase";




export class UserMessages{
  constructor(
    private readonly getMsg:GetUserMessagesUsecase
  ) {
    
  }
 public async handle(req: Request, res: Response, next: NextFunction): Promise<void> {

   try {
     const { conversationId } = req.params;

      if (!conversationId) {
        throw new BadRequestError('data not found', 'UserMessages() Controller ');
      }


      const found: IGetMessageResult = await this.getMsg.execute({conversationId});
      

      if (!found || !found.messages) {
        throw new BadRequestError('Missing Content', 'UserMessages() Controller');
      }

      res.status(StatusCodes.OK).json({ message: 'Chat UserMessages', messages:found.messages });

    } catch (error) {
      next(error);
    }
  }



}