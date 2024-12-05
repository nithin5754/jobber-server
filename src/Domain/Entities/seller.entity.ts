import { ILanguage, IExperience, IEducation, ICertificate, SellerParams } from '../interface/iseller.interface';
import _ from 'lodash';
import moment from 'moment';

export class Seller {
  id?: string;
  userId?: string;
  profilePublicId?: string;
  fullName: string;
  username?: string;
  email?: string;
  profilePicture?: string;
  description: string;
  country: string;
  oneliner: string;
  skills: string[];
  ratingsCount?: number;
  ratingSum?: number;
  // ratingCategories?: IRatingCategories;
  languages: ILanguage[];
  responseTime: number;
  recentDelivery?: string;
  experience: IExperience[];
  education: IEducation[];
  socialLinks: string[];
  certificates: ICertificate[];
  ongoingJobs?: number;
  completedJobs?: number;
  cancelledJobs?: number;
  totalEarnings?: number;
  totalGigs?: number;
  paypal?: string;
  createdAt?: string|Date;
  updatedAt?: string |Date;

  constructor(params: SellerParams) {
    this.id = params._id?.toString() as string;
    this.userId = params.userId?.toString() as string;
    this.fullName = params.fullName;
    this.description = params.description;
    this.country = params.country;
    this.oneliner = params.oneliner;
    this.skills = params.skills;
    this.languages = params.languages;
    this.responseTime = params.responseTime;
    this.experience = params.experience;
    this.education = params.education;
    this.socialLinks = params.socialLinks;
    this.certificates = params.certificates;
    this.profilePublicId = params.profilePublicId;
    this.username = params.username;
    this.email = params.email;
    this.profilePicture = params.profilePicture;
    this.ratingsCount = params.ratingsCount;
    this.ratingSum = params.ratingSum;
    this.recentDelivery = moment(params.recentDelivery).format('MMMM D, YYYY - h:mm A');
    this.ongoingJobs = params.ongoingJobs;
    this.completedJobs = params.completedJobs;
    this.cancelledJobs = params.cancelledJobs;
    this.totalEarnings = params.totalEarnings;
    this.totalGigs = params.totalGigs;
    this.paypal = params.paypal;
    // this.createdAt = moment(params.createdAt).format('MMMM D, YYYY - h:mm A');
    // this.updatedAt = moment(params.updatedAt).format('MMMM D, YYYY - h:mm A');
    this.createdAt=params.createdAt;
    this.updatedAt=params.updatedAt;


  }
}
