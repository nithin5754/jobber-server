import { ObjectId } from "mongoose";



export interface IPersonalInfoData {
  [key: string]: string;
  fullName: string;
  description: string;
  profilePicture: string;
  responseTime: string;
  oneliner: string;
}
export interface IExperience {
  [key: string]: string | number | boolean | undefined;
 _id?: string;
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  description: string;
  currentlyWorkingHere: boolean | undefined;
}

export interface IEducation {
  [key: string]: string | number | undefined;
 _id?: string;
  country: string;
  university: string;
  title: string;
  major: string;
  year: string;
}

export interface ILanguage {
  [key: string]: string | number | undefined;
 _id?: string;
  language: string;
  level: string;
}

export interface ICertificate {
  [key: string]: string | number | undefined;
 _id?: string;
  name: string;
  from: string;
  year: number | string;
}




export interface ISeller {
  _id?: string;
  userId?:string;
  fullName?: string;
  description?: string;
  country?: string;
  oneliner?: string;
  skills?: string[];
  languages?: ILanguage[];
  responseTime?: number;
  experience?: IExperience[];
  education?: IEducation[];
  socialLinks?: string[];
  certificates?: ICertificate[];
  profilePublicId?: string;
  username?: string;
  email?: string;
  profilePicture?: string;
  ratingsCount?: number;
  ratingSum?: number;
  recentDelivery?: Date;
  ongoingJobs?: number;
  completedJobs?: number;
  cancelledJobs?: number;
  totalEarnings?: number;
  totalGigs?: number;
  paypal?: string;
  createdAt?: Date;
  updatedAt?: Date;
}


export interface ISellerDocument {
  _id?: ObjectId;
  userId?:ObjectId;
  fullName: string;
  description: string;
  country: string;
  oneliner: string;
  skills: string[];
  languages: ILanguage[];
  responseTime: number;
  experience: IExperience[];
  education: IEducation[];
  socialLinks: string[];
  certificates: ICertificate[];
  profilePublicId?: string;
  username?: string;
  email?: string;
  profilePicture?: string;
  ratingsCount?: number;
  ratingSum?: number;
  recentDelivery?: Date;
  ongoingJobs?: number;
  completedJobs?: number;
  cancelledJobs?: number;
  totalEarnings?: number;
  totalGigs?: number;
  paypal?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SellerParams {
  _id?: ObjectId;
  userId?:ObjectId;
  fullName: string;
  description: string;
  country: string;
  oneliner: string;
  skills: string[];
  languages: ILanguage[];
  responseTime: number;
  experience: IExperience[];
  education: IEducation[];
  socialLinks: string[];
  certificates: ICertificate[];
  profilePublicId?: string;
  username?: string;
  email?: string;
  profilePicture?: string;
  ratingsCount?: number;
  ratingSum?: number;
  recentDelivery?: Date;
  ongoingJobs?: number;
  completedJobs?: number;
  cancelledJobs?: number;
  totalEarnings?: number;
  totalGigs?: number;
  paypal?: string;
  createdAt?: Date;
  updatedAt?: Date;
}



export type SellerType =
| string
| string[]
| number
// | IRatingCategories
| Date
| IExperience
| IExperience[]
| IEducation
| IEducation[]
| ICertificate
| ICertificate[]
| ILanguage
| ILanguage[]
| unknown
| undefined;