



import { Message } from '../../../Domain/Entities/Chat';
import { ChatRepository } from '../../../Infrastructure/databse/mongoose/Repositories/chat.repository';
import { BadRequestError } from '../../../Presentation/error/error.interface';
import { IRepoResponse } from '../../../shared/IBase-repository';


import { IUseCase } from '../../../shared/IUsecase';

export interface IUpdateOfferDTO {
  messageId: string;
  type:any
}

export interface IUpdateOfferResult {
  message:Message
}
export class UpdateOfferReadUsecase implements IUseCase<IUpdateOfferDTO, IUpdateOfferResult> {
  constructor(private readonly messageService: ChatRepository) {}
  public async execute(input: IUpdateOfferDTO): Promise<IUpdateOfferResult> {

 const result:IRepoResponse=await this.messageService.updateOffer(input.messageId,input.type)

if(!result||!result.MessageDetails){
          throw new BadRequestError('Not Found, Something Went Wrong', 'UpdateOfferReadUsecase() Missing');
  
}

return {
  message:result.MessageDetails
}

   
  }


}

