
import { IChatData,  } from '../../../Domain/interface/IChat.interface';
import { ChatRepository } from '../../../Infrastructure/databse/mongoose/Repositories/chat.repository';


import { IUseCase } from '../../../shared/IUsecase';

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
