import { Message } from '../../../Domain/Entities/Chat';
import { IConversation } from '../../../Domain/interface/IChat.interface';

import { ChatRepository } from '../../../Infrastructure/databse/mongoose/Repositories/chat.repository';
import { BadRequestError } from '../../../Presentation/error/error.interface';
import { IRepoResponse } from '../../../shared/IBase-repository';
import { IUseCase } from '../../../shared/IUsecase';

export interface IConversationListDTO {
  username:string
}

export interface IConversationListResult {
  messages:Message[];
}

export class ConversationListUsecase implements IUseCase<IConversationListDTO, IConversationListResult> {
  constructor(private readonly  chatRepo: ChatRepository) {}
  public async execute(input: IConversationListDTO): Promise<IConversationListResult> {

const result:IRepoResponse=await this.chatRepo.getUserConversationList({
filter:{username:input.username}
})
    if (!result || !result.messageDetailsArray) {
      throw new BadRequestError('Not Found/Empty', 'GetConversationUsecase() Missing');
    }

    return {
      messages: result.messageDetailsArray
    };
  }


  
}
