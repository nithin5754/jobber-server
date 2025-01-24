import { ObjectId } from "mongoose";


export interface SellerGigDocument {
  _id: ObjectId;
  sellerId: ObjectId;
  userId:ObjectId;
  title: string;
  description: string;
  active?: boolean;
  categories: string;
  subCategories: string[];
  tags: string[];
  ratingsCount?: number; 
  ratingSum?: number; 
  // ratingCategories?: IRatingCategories;
  expectedDelivery: string;
  basicTitle: string;
  basicDescription: string;
  price: number;
  coverImage: string;
  createdAt?: Date | string;
  sortId?: number;

}


export interface ISellerGig {
  _id?:string|ObjectId,
  id?:string,
  sellerId?: string;
  userId?:string;
  title?: string;

  description?: string;
  active?: boolean;
  categories?: string;
  subCategories?: string[];
  tags?: string[];
  ratingsCount?: number; 
  ratingSum?: number; 
  // ratingCategories?: IRatingCategories;
  expectedDelivery?: string;
  basicTitle?: string;
  basicDescription?: string;
  price?: number;
  coverImage?: string;
  createdAt?: Date | string;
  sortId?: number;

}


export interface ISellerGigParams {
  _id: ObjectId;
  sellerId: ObjectId;
  userId:ObjectId;
  title: string;
  username?: string;
  profilePicture?: string;
  email?: string;
  description: string;
  active?: boolean;
  categories: string;
  subCategories: string[];
  tags: string[];
  ratingsCount?: number; 
  ratingSum?: number; 
  // ratingCategories?: IRatingCategories;
  expectedDelivery: string;
  basicTitle: string;
  basicDescription: string;
  price: number;
  coverImage: string;
  createdAt?: Date | string;
  sortId?: number;

}





