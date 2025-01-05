import { io } from '../../..';
import { Message } from '../../../Domain/Entities/Chat';
import { IChatData } from '../../../Domain/interface/ichat.interface';
import { ChatRepository } from '../../../Infrastructure/databse/mongoose/Repositories/chat.repository';
import { BadRequestError } from '../../../Presentation/error/error.interface';
import { IRepoResponse } from '../../../shared/ibase-repository';


import { IUseCase } from '../../../shared/iusecase';

export interface ICreateMessageDTO {
  messageData: IChatData;
}

export interface ICreateMessageResult {
  message: Message;
}

export class CreateMessageUsecase implements IUseCase<ICreateMessageDTO, ICreateMessageResult> {
  constructor(private readonly messageService: ChatRepository) {}
  public async execute(input: ICreateMessageDTO): Promise<ICreateMessageResult> {
    const response:IRepoResponse = await this.messageService.create({
      message: input.messageData
    })

    if (!response?.MessageDetails) {
      throw new BadRequestError(
        'Failed to save message',
        'CreateMessageUseCase: Message creation failed'
      );
    }
    // if (messageResult.MessageDetails.hasOffer) {
    //   const emailMessageDetails: IMessageDetails = {
    //     sender: messageResult.MessageDetails..senderUsername,
    //     amount: `${messageResult.MessageDetails..offer?.price}`,
    //     buyerUsername: lowerCase(`${messageResult.MessageDetails..receiverUsername}`),
    //     sellerUsername: lowerCase(`${messageResult.MessageDetails..senderUsername}`),
    //     title: messageResult.MessageDetails..offer?.gigTitle,
    //     description: messageResult.MessageDetails..offer?.description,
    //     deliveryDays: `${messageResult.MessageDetails..offer?.deliveryInDays}`,
    //     template: 'offer'
    //   };
    io.emit('message received', {message:response.MessageDetails??{}});
    return{
      message:response.MessageDetails as Message
    }


    }


  
  }

