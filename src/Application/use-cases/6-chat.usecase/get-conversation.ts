import { Message } from '../../../Domain/Entities/Chat';
import { IConversation } from '../../../Domain/interface/IChat.interface';

import { ChatRepository } from '../../../Infrastructure/databse/mongoose/Repositories/chat.repository';
import { BadRequestError } from '../../../Presentation/error/error.interface';
import { IRepoResponse } from '../../../shared/IBase-repository';
import { IUseCase } from '../../../shared/IUsecase';

export interface IGetConversationDTO {
  sender: string;
  receiver: string;
}

export interface IGetConversationResult {
  conversations:IConversation[];
}

export class GetConversationUsecase implements IUseCase<IGetConversationDTO, IGetConversationResult> {
  constructor(private readonly  chatRepo: ChatRepository) {}
  public async execute(input: IGetConversationDTO): Promise<IGetConversationResult> {
    const conversation:IRepoResponse = await this. chatRepo.getConversation(input.sender, input.receiver);

    if (!conversation || !conversation.conversationDetailsArray) {
      throw new BadRequestError('Not Found/Empty', 'GetConversationUsecase() Missing');
    }

    return {
      conversations: conversation.conversationDetailsArray
    };
  }


  
}
