import { Request, Response, NextFunction } from "express";

import { IChatData } from "../../../Interface/IChat.interface";
import { StatusCodes } from "http-status-codes";
import { CreateConversationUsecase } from "../../../UseCases/6-chat-usecase/create-conversation";
import { CreateMessageUsecase } from "../../../UseCases/6-chat-usecase/create-usecase";






export class CreateMessage {
  constructor(
    private readonly createMsg:CreateMessageUsecase,
    private readonly createConversation:CreateConversationUsecase
  ) {
    
  }
  public async  handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {



      const messageData: IChatData = {
        conversationId: req.body.conversationId,
        body: req.body.body,
        fileType: req.body.fileType,
        file:req.body.file,
        fileSize: req.body.fileSize,
        fileName: req.body.fileName,
        gigId: req.body.gigId,
        buyerId: req.body.buyerId,
        sellerId: req.body.sellerId,
        senderUsername: req.body.senderUsername,
        senderPicture: req.body.senderPicture,
        receiverUsername: req.body.receiverUsername,
        receiverPicture: req.body.receiverPicture,
        isRead: req.body.isRead,
        hasOffer: req.body.hasOffer,
        offer: req.body.offer
      };

      if (!req.body.hasConversationId) {
        const data:IChatData={
          conversationId:`${messageData.conversationId}`,
          senderUsername: req.body.senderUsername,
          receiverUsername: req.body.receiverUsername,
        }
        await this.createConversation.execute({data});
      }
      await this.createMsg.execute({messageData});
      res.status(StatusCodes.OK).json({ message: 'Message added', conversationId: req.body.conversationId, messageData });

    } catch (error) {
      next(error)
    }
  }




}