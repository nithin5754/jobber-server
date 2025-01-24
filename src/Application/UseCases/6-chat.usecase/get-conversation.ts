
import { IConversation } from '../../../Domain/Interface/IChat.interface';
import { IRepoResponse } from '../../../IBaseRepositories';

import {  getConversationChat } from '../../../Infrastructure/Database/Mongoose/Repositories/chat.repository';
import { BadRequestError } from '../../../Presentation/Error/errorInterface';

export interface IGetConversationDTO {
  sender: string;
  receiver: string;
}

export interface IGetConversationResult {
  conversations:IConversation[];
}

export class GetConversationUsecase  {

  public async execute(input: IGetConversationDTO): Promise<IGetConversationResult> {
    const conversation:IRepoResponse = await getConversationChat (input.sender, input.receiver);

    if (!conversation || !conversation.conversationDetailsArray) {
      throw new BadRequestError('Not Found/Empty', 'GetConversationUsecase() Missing');
    }

    return {
      conversations: conversation.conversationDetailsArray
    };
  }


  
}
