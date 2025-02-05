import { getUserConversationListChat } from "../../Database/Mongoose/Repositories/chat.repository";
import { Message } from "../../Entities/Chat";
import { IRepoResponse } from "../../IBaseRepositories";
import { BadRequestError } from "../../Presentation/Error/errorInterface";


export interface IConversationListDTO {
  username:string
}

export interface IConversationListResult {
  messages:Message[];
}

export class ConversationListUsecase  {

  public async execute(input: IConversationListDTO): Promise<IConversationListResult> {

const result:IRepoResponse=await getUserConversationListChat ({
filter:{username:input.username}
})
    if (!result || !result.messageDetailsArray) {
      throw new BadRequestError('Not Found/Empty', 'GetConversationUsecase() Missing');
    }

    return {
      messages: result.messageDetailsArray
    };
  }


  
}
