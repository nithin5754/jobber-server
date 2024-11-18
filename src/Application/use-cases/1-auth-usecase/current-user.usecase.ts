import { User } from "../../../Domain/Entities/User";

import { UserRepository } from "../../../Infrastructure/databse/mongoose/Repositories/UserRepository";
import { BadRequestError } from "../../../Presentation/error/error.interface";
import { IRepoResponse } from "../../../shared/IBaseRepository";
import { IUseCase } from "../../../shared/IUseCase";




export interface ICurrentUseDTO {
  userId:string
}

export interface ICurrentUserResult {
    user:User
}



export class CurrentUserUsecase implements IUseCase<ICurrentUseDTO,ICurrentUserResult> {
  constructor(
    private readonly userService:UserRepository
  ) {
    
  }
 public async execute(input: ICurrentUseDTO): Promise<ICurrentUserResult> {
   const {userId}=input



   const found:IRepoResponse= await this.userService.findOne({data:{_id:userId}});



   if(!found||found.isNull||!found.user){
    throw new BadRequestError('Invalid credentials', 'SignIn read() method error');

   }
   



   return {
    user:found.user
   }

  }
}