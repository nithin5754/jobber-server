
import { ChatRepository } from '../../../Infrastructure/Database/Mongoose/Repositories/chat.repository';


import { IUseCase } from '../../../Shared/IUseCases';

export interface IMarkSingleMessageDTO {
  id: string;
}


export class MarkMessageAsReadUsecase implements IUseCase<IMarkSingleMessageDTO, void> {
  constructor(private readonly messageService: ChatRepository) {}
  public async execute(input: IMarkSingleMessageDTO): Promise<void> {

await this.messageService.update(input.id, { updateMessage: { isRead: true } });



   
  }


}

