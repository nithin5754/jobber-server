import { createConversationChat } from "../../Database/Mongoose/Repositories/chat.repository";
import { IChatData } from "../../Interface/IChat.interface";




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
