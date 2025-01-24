
import { IChatData,  } from '../../../Interface/IChat.interface';
import { createConversationChat } from '../../../Infrastructure/Database/Mongoose/Repositories/chat.repository';




export interface ICreateConversationDTO {
  data: IChatData;
}

export class CreateConversationUsecase  {

  public async execute(input: ICreateConversationDTO): Promise<void> {
    await createConversationChat ({
      message: input.data
    });
  }
}
