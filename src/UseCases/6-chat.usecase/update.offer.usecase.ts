import { updateOfferChat } from "../../Database/Mongoose/Repositories/chat.repository";
import { Message } from "../../Entities/Chat";
import { IRepoResponse } from "../../IBaseRepositories";
import { BadRequestError } from "../../Presentation/Error/errorInterface";



export interface IUpdateOfferDTO {
  messageId: string;
  type:any
}

export interface IUpdateOfferResult {
  message:Message
}
export class UpdateOfferReadUsecase {

  public async execute(input: IUpdateOfferDTO): Promise<IUpdateOfferResult> {

 const result:IRepoResponse=await updateOfferChat(input.messageId,input.type)

if(!result||!result.MessageDetails){
          throw new BadRequestError('Not Found, Something Went Wrong', 'UpdateOfferReadUsecase() Missing');
  
}

return {
  message:result.MessageDetails
}

   
  }


}

