
import { ChatRepository } from '../../../Infrastructure/Database/Mongoose/Repositories/chat.repository';


import { IUseCase } from '../../../Shared/IUsecase';

export interface IMarkMultipleMessageDTO {
  messageId: string;
  senderUsername: string;
  receiverUsername: string;
}



export class MarkMultipleMessageAsReadUsecase implements IUseCase<IMarkMultipleMessageDTO, void> {
  constructor(private readonly messageService: ChatRepository) {}
  public async execute(input: IMarkMultipleMessageDTO): Promise<void> {
   await this.messageService.updateMultiple({
      updateFilterMultipleMessage: {
        _id: input.messageId,
        receiverUsername: input.receiverUsername,
        senderUsername: input.senderUsername
      },
      updateMessage: { isRead: true }
    });


   
  }
}
