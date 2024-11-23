import moment from 'moment';
import { ObjectId } from 'mongoose';

export interface IBuyer {
  _id?: string;
  username?: string;
  userId?: string;
  email?: string;
  profilePicture?: string;
  country?: string;
  isSeller?: boolean;
  purchasedGigs?: string[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface IBuyerDocument {
  _id?: string | ObjectId;
  username?: string;
  email?: string;
  profilePicture?: string;
  country?: string;
  isSeller?: boolean;
  purchasedGigs?: string[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export type BuyerParams = {
  _id?: string;
  userId?: string;
  username?: string;
  email?: string;
  country?: string;
  profilePicture?: string;
  isSeller?: boolean;
  purchasedGigs?: string[];
  createdAt?: string;
  updatedAt?: string;
};

export class Buyer {
  id?: string | ObjectId;
  username?: string;
  userId?: string;
  email?: string;
  profilePicture?: string;
  country?: string;
  isSeller?: boolean;
  purchasedGigs?: string[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
  constructor(input: BuyerParams) {
    this.id = input._id?.toString() as string;
    this.username = input.username;
    this.userId = input.userId?.toString() as string;
    this.country = input.country;
    this.email = input.email;
    this.profilePicture = input.profilePicture;
    this.isSeller = input.isSeller;
    this.purchasedGigs = input.purchasedGigs;
    this.createdAt = moment(input.createdAt).format('MMMM D, YYYY - h:mm A');
    this.updatedAt = moment(input.updatedAt).format('MMMM D, YYYY - h:mm A');
  }
}
