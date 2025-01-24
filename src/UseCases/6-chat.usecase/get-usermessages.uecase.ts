import { getUserMessagesChat } from "../../Database/Mongoose/Repositories/chat.repository";
import { Message } from "../../Entities/Chat";
import { IRepoResponse } from "../../IBaseRepositories";
import { BadRequestError } from "../../Presentation/Error/errorInterface";


export interface IGetUserMessagesDTO {
  conversationId: string;
}

export interface IGetUserMessagesResult {
  messages: Message[];
}

export class GetUserMessagesUsecase {
  public async execute(input: IGetUserMessagesDTO): Promise<IGetUserMessagesResult> {
    const result: IRepoResponse = await getUserMessagesChat(input.conversationId);

    if (!result || !result.messageDetailsArray) {
      throw new BadRequestError('Not Found/Empty', 'GetConversationUsecase() Missing');
    }

    return {
      messages: result.messageDetailsArray
    };
  }
}
