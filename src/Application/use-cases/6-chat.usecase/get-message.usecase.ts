import { Message } from '../../../Domain/Entities/Chat';

import { ChatRepository } from '../../../Infrastructure/databse/mongoose/Repositories/chat.repository';
import { BadRequestError } from '../../../Presentation/error/error.interface';
import { IRepoResponse } from '../../../Shared/IBase-repository';
import { IUseCase } from '../../../Shared/IUsecase';

export interface IGetMessageDTO {
  sender: string;
  receiver: string;
}

export interface IGetMessageResult {
  messages: Message[];
}

export class GetMessageUsecase implements IUseCase<IGetMessageDTO, IGetMessageResult> {
  constructor(private readonly messageService: ChatRepository) {}
  public async execute(input: IGetMessageDTO): Promise<IGetMessageResult> {
    const message:IRepoResponse = await this.messageService.getMessages(input.sender, input.receiver);

    if (!message || !message.messageDetailsArray) {
      throw new BadRequestError('Not Found/Empty', 'GetMessageUsecase() Missing');
    }

    return {
      messages: message.messageDetailsArray
    };
  }
}
