import { NextFunction,Request,Response } from "express";
import { BadRequestError } from "../../Error/errorInterface";

import { StatusCodes } from "http-status-codes";
import { GetMessageUsecase, IGetMessageResult } from "../../../UseCases/6-chat.usecase/get-message.usecase";




export class Messages  {
  constructor(
    private readonly getMsg:GetMessageUsecase
  ) {
    
  }
 public async handle(req: Request, res: Response, next: NextFunction): Promise<void> {

  console.log("messages")
    try {
      const { senderUsername, receiverUsername } = req.params;

      if (!senderUsername||!receiverUsername) {
        throw new BadRequestError('data not found', 'Messages() Controller ');
      }


      const found: IGetMessageResult = await this.getMsg.execute({receiver:receiverUsername,sender:senderUsername});

      if (!found || !found.messages) {
        throw new BadRequestError('Missing Content', 'Messages() Controller');
      }
      res.status(StatusCodes.OK).json({ message: 'Chat messages', messages:found.messages });

    } catch (error) {
      next(error);
    }
  }



}