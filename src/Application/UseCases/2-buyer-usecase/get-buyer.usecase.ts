import { Buyer } from "../../../Entities/Buyer";
import { IRepoResponse } from "../../../IBaseRepositories";
import {  findOneBuyer } from "../../../Infrastructure/Database/Mongoose/Repositories/buyer.repository";
import { BadRequestError } from "../../../Presentation/Error/errorInterface";





export interface IGetBuyerDTO {
   email?:string;
   username?:string;
   userId?:string
}

export interface IGetBuyerResult{

  buyer:Buyer


}




export class GetBuyerUsecase  {


 public async execute(input: IGetBuyerDTO): Promise<IGetBuyerResult> {

  const found:IRepoResponse=await findOneBuyer({buyer:
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