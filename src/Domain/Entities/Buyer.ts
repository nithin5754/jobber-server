import { ObjectId } from "mongoose";



export interface IBuyer {
  id?:string;
  username?:string;
  email?:string;
  profilePicture?:string;
  country?:string;
  isSeller?:boolean;
  purchasedGigs:string[];
  createdAt:Date|string;
  updatedAt:Date|string
}


export interface IBuyerDocument {
  _id?: string | ObjectId;
  username?: string;
  email?: string;
  profilePicture?: string;
  country: string;
  isSeller?: boolean;
  purchasedGigs: string[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
