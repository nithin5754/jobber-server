
import { IConversation } from '../../../Domain/Interface/IChat.interface';

import { ChatRepository } from '../../../Infrastructure/Database/Mongoose/Repositories/chat.repository';
import { BadRequestError } from '../../../Presentation/Error/errorInterface';
import { IRepoResponse } from '../../../Shared/IBaseRepositories';
import { IUseCase } from '../../../Shared/IUseCases';

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
