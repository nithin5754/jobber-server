import { ICreateUserDTO } from "../../Application/use-cases/1-auth-usecase/register.usecase";
import { IBaseRepository } from "../../shared/IBaseRepository";
import { IUser, User } from "../Entities/User";

export interface IRepoResponse {
  user?:User;
  usersDetails?:User[],
  isNull?:boolean;
  isUpdate?:boolean;
  
}

export interface IRepoRequest {
  updateCheck?:IUser
  data?:IUser
}

export interface IUserRepository extends IBaseRepository<IRepoRequest,IRepoResponse> {

  findOne(criteria: IRepoRequest): Promise<IRepoResponse>

  updateUsingOtherFields({updateCheck, data}: IRepoRequest): Promise<IRepoResponse> 

   isUsernameOrEmailExist(username:string,email:string):Promise<{username:boolean,email:boolean}> 
}