import { findOneByUser } from "../../Database/Mongoose/Repositories/UserRespository";
import { User } from "../../Entities/User";
import { IRepoResponse } from "../../IBaseRepositories";
import { BadRequestError } from "../../Presentation/Error/errorInterface";





export interface ICurrentUseDTO {
  userId:string
}

export interface ICurrentUserResult {
    user:User
}

export class CurrentUserUsecase  {

 public async execute(input: ICurrentUseDTO): Promise<ICurrentUserResult> {
   const {userId}=input



   const found:IRepoResponse= await findOneByUser({data:{_id:userId}});



   if(!found||found.isNull||!found.user){
    throw new BadRequestError('Invalid credentials', 'SignIn read() method error');

   }
   



   return {
    user:found.user
   }

  }
}