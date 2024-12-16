import { Buyer, IBuyer } from "../Domain/Entities/Buyer";
import { SellerGig } from "../Domain/Entities/gig.entity";
import { Seller } from "../Domain/Entities/seller.entity";
import { IUser, User } from "../Domain/Entities/User";
import { ISellerGig } from "../Domain/interface/igig.interface";
import { ISeller } from "../Domain/interface/iseller.interface";

export interface IRepoResponse {
  user?:User;
  buyer?:Buyer;
  buyerArray?:Buyer[];
  seller?:Seller;
  sellerArray?:Seller[];
  gig?:SellerGig;
  gigArray?:SellerGig[];

  isNull?:boolean;
  isUpdate?:boolean;
  
}

export interface IRepoRequest {
  filter?:IUser
  data?:IUser
  query?:string;
  count?:number
  seller?:ISeller
  sellerFilter?:ISeller
  gig_filter?:{
    min_price:string|null,
    max_price:string|null
    delivery_time:string|null
  }
  gig?:ISellerGig
  buyer?:IBuyer
  buyerFilter?:IBuyer
}

export interface IBaseRepository<TInput,TOutput> {
  create(data:TInput):Promise<TOutput>
  findOne(criteria:TInput):Promise<TOutput>
  update(id:string,data:TInput):Promise<TOutput>
  delete(id:string):Promise<boolean>
}