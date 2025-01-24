
import { IChatData,  } from '../../../Domain/Interface/IChat.interface';
import { ChatRepository } from '../../../Infrastructure/Database/Mongoose/Repositories/chat.repository';


import { IUseCase } from '../../../Shared/IUsecases';

export interface ICreateConversationDTO {
  data: IChatData;
}

export class CreateConversationUsecase implements IUseCase<ICreateConversationDTO, void> {
  constructor(private readonly messageService: ChatRepository) {}
  public async execute(input: ICreateConversationDTO): Promise<void> {
    await this.messageService.createConversation({
      message: input.data
    });
  }
}
