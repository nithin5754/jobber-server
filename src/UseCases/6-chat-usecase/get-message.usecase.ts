import { getMessagesChat } from "../../Database/Mongoose/Repositories/chat.repository";
import { Message } from "../../Entities/Chat";
import { IRepoResponse } from "../../IBaseRepositories";
import { BadRequestError } from "../../Presentation/Error/errorInterface";


export interface IGetMessageDTO {
  sender: string;
  receiver: string;
}

export interface IGetMessageResult {
  messages: Message[];
}

export class GetMessageUsecase {

  public async execute(input: IGetMessageDTO): Promise<IGetMessageResult> {
    const message:IRepoResponse = await getMessagesChat(input.sender, input.receiver);

    if (!message || !message.messageDetailsArray) {
      throw new BadRequestError('Not Found/Empty', 'GetMessageUsecase() Missing');
    }

    return {
      messages: message.messageDetailsArray
    };
  }
}
