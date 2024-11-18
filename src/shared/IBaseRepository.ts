import { Buyer, IBuyer } from "../Domain/Entities/Buyer";
import { IUser, User } from "../Domain/Entities/User";

export interface IRepoResponse {
  user?:User;
  buyer?:Buyer;
  isNull?:boolean;
  isUpdate?:boolean;
  
}

export interface IRepoRequest {
  filter?:IUser
  data?:IUser
  buyer?:IBuyer
  buyerFilter?:IBuyer
}

export interface IBaseRepository<TInput,TOutput> {
  create(data:TInput):Promise<TOutput>
  findOne(criteria:TInput):Promise<TOutput>
  update(id:string,data:TInput):Promise<TOutput>
  delete(id:string):Promise<boolean>
}