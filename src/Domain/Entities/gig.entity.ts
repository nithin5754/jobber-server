import moment from 'moment';
import {  ISellerGigParams } from '../interface/igig.interface';

export class SellerGig{
  id?: string;
  sellerId?: string;
  userId?:string;
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
  constructor(params: ISellerGigParams) {
    this.id = params._id.toString() as string;
    this.sellerId = params.sellerId.toString() as string;
    this.userId=params.userId.toString() as string;
    this.title = params.title;
    this.username = params.username;
    this.profilePicture = params.profilePicture;
    this.email = params.email;
    this.description = params.description;
    this.active = params.active;
    this.categories = params.categories;
    this.subCategories = params.subCategories;
    this.tags = params.tags;
    this.ratingsCount = params.ratingsCount;
    this.ratingSum = params.ratingSum;
    // this.ratingCategories = params.ratingCategories; // Uncomment if needed and present in SellerGigDocument
    this.expectedDelivery = params.expectedDelivery;
    this.basicTitle = params.basicTitle;
    this.basicDescription = params.basicDescription;
    this.price = params.price;
    this.coverImage = params.coverImage;
    this.createdAt = moment(params.createdAt).format('MMMM D, YYYY - h:mm A');
    this.sortId = params.sortId;
  }
}
