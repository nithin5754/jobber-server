
import { IUseCase } from "src/Shared/IUsecases";
import { User } from "../../../Domain/Entities/User";
import { UserRepository } from "../../../Infrastructure/Database/Mongoose/Repositories/UserRespository";
import { BadRequestError } from "../../../Presentation/Error/errorInterface";
import { IRepoResponse } from "src/Shared/IBaseRepositories";















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