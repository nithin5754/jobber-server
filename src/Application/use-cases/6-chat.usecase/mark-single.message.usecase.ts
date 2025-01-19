
import { ChatRepository } from '../../../Infrastructure/databse/mongoose/Repositories/chat.repository';


import { IUseCase } from '../../../shared/IUsecase';

export interface IMarkSingleMessageDTO {
  id: string;
}


export class MarkMessageAsReadUsecase implements IUseCase<IMarkSingleMessageDTO, void> {
  constructor(private readonly messageService: ChatRepository) {}
  public async execute(input: IMarkSingleMessageDTO): Promise<void> {

await this.messageService.update(input.id, { updateMessage: { isRead: true } });



   
  }


}

