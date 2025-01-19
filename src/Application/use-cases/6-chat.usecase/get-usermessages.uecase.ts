

import { Message } from '../../../Domain/Entities/Chat';

import { ChatRepository } from '../../../Infrastructure/databse/mongoose/Repositories/chat.repository';
import { BadRequestError } from '../../../Presentation/error/error.interface';
import { IRepoResponse } from '../../../shared/IBase-repository';
import { IUseCase } from '../../../shared/IUsecase';

export interface IGetUserMessagesDTO {
 conversationId:string
}

export interface IGetUserMessagesResult {
  messages:Message[];
}

export class GetUserMessagesUsecase implements IUseCase<IGetUserMessagesDTO, IGetUserMessagesResult> {
  constructor(private readonly  chatRepo: ChatRepository) {}
  public async execute(input: IGetUserMessagesDTO): Promise<IGetUserMessagesResult> {
    const result:IRepoResponse = await this. chatRepo.getUserMessages(input.conversationId)

    if (!result || !result.messageDetailsArray) {
      throw new BadRequestError('Not Found/Empty', 'GetConversationUsecase() Missing');
    }

    return {
     messages:result.messageDetailsArray
    };
  }


  
}
