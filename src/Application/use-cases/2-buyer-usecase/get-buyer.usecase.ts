import { Buyer } from "../../../Domain/Entities/Buyer";
import { BuyerRepositories } from "../../../Infrastructure/databse/mongoose/Repositories/BuyerRepositories";
import { BadRequestError } from "../../../Presentation/error/error.interface";
import { IRepoResponse } from "../../../shared/IBaseRepository";
import { IUseCase } from "../../../shared/IUseCase";



export interface IGetBuyerDTO {
   email?:string;
   username?:string;
   userId?:string
}

export interface IGetBuyerResult{

  buyer:Buyer


}




export class GetBuyerUsecase implements IUseCase<IGetBuyerDTO,IGetBuyerResult> {

 constructor (
  private buyerservice:BuyerRepositories
 ){}

 public async execute(input: IGetBuyerDTO): Promise<IGetBuyerResult> {

  const found:IRepoResponse=await this.buyerservice.findOne({buyer:
    input.email?
    {email:input.email}
    :
    input.userId?
    {_id:input.userId}
    :
    {username:input.username}

    })
    
    if(!found||found.isNull||!found.buyer){
      throw new BadRequestError('no buyer found', 'Get Buyer () method error');
    }

    return {
buyer:found.buyer
    }

  }

  

}