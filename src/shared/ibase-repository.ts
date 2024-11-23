import { Buyer, IBuyer } from "../Domain/Entities/Buyer";
import { Seller } from "../Domain/Entities/seller.entity";
import { IUser, User } from "../Domain/Entities/User";
import { ISeller } from "../Domain/interface/iseller.interface";

export interface IRepoResponse {
  user?:User;
  buyer?:Buyer;
  seller?:Seller;
  sellerArray?:Seller[];
  isNull?:boolean;
  isUpdate?:boolean;
  
}

export interface IRepoRequest {
  filter?:IUser
  data?:IUser
  seller?:ISeller
  sellerFilter?:ISeller
  
  buyer?:IBuyer
  buyerFilter?:IBuyer
}

export interface IBaseRepository<TInput,TOutput> {
  create(data:TInput):Promise<TOutput>
  findOne(criteria:TInput):Promise<TOutput>
  update(id:string,data:TInput):Promise<TOutput>
  delete(id:string):Promise<boolean>
}