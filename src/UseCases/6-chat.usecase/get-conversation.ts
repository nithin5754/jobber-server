import { getConversationChat } from "../../Database/Mongoose/Repositories/chat.repository";
import { IRepoResponse } from "../../IBaseRepositories";
import { IConversation } from "../../Interface/IChat.interface";
import { BadRequestError } from "../../Presentation/Error/errorInterface";


export interface IGetConversationDTO {
  sender: string;
  receiver: string;
}

export interface IGetConversationResult {
  conversations:IConversation[];
}

export class GetConversationUsecase  {

  public async execute(input: IGetConversationDTO): Promise<IGetConversationResult> {
    const conversation:IRepoResponse = await getConversationChat (input.sender, input.receiver);

    if (!conversation || !conversation.conversationDetailsArray) {
      throw new BadRequestError('Not Found/Empty', 'GetConversationUsecase() Missing');
    }

    return {
      conversations: conversation.conversationDetailsArray
    };
  }


  
}
