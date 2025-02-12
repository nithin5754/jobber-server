import { Buyer, IBuyer } from "./Entities/Buyer";
import { Message } from "./Entities/Chat";
import { SellerGig } from "./Entities/Gig";
import { Seller } from "./Entities/Seller";
import { User, IUser } from "./Entities/User";
import { IConversation, IChatData } from "./Interface/IChat.interface";
import { ISellerGig } from "./Interface/IGig.interface";
import { IOrder, IOrderDocument } from "./Interface/IOrder.interface";
import { IReview, IReviewDocument } from "./Interface/IReview.interface";
import { ISeller } from "./Interface/ISeller.interface";


export interface IRepoResponse {
  user?: User;
  buyer?: Buyer;
  buyerArray?: Buyer[];
  seller?: Seller;
  sellerArray?: Seller[];
  gig?: SellerGig;
  gigArray?: SellerGig[];
  isNull?: boolean;
  isUpdate?: boolean;
  MessageDetails?: Message;
  messageDetailsArray?:Message[]
  conversationDetailsArray?:IConversation[]
  conversation?:IConversation;
  order?:IOrderDocument;
  orders?:IOrderDocument[];
  review?:IReviewDocument;
  reviews?:IReviewDocument[];
}

export interface IRepoRequest {
  filter?: IUser;
  data?: IUser;
  query?: string;
  count?: number;
  seller?: ISeller;
  sellerFilter?: ISeller;
  gig_filter?: {
    min_price: string | null;
    max_price: string | null;
    delivery_time: string | null;
  };

  gig_moreLike_filter?: {
    id?: string;
    categories?: string;
    // tags: string[];
    // subCategories: string[];
    expectedDelivery?: string;
    basicDescription?: string;
  };
  gig?: ISellerGig;
  buyer?: IBuyer;
  buyerFilter?: IBuyer;
  message?: IChatData;
  updateMessage?:{
    isRead?:boolean,

    
  };
  order?:IOrder;

  review?:IReview

  updateFilterMultipleMessage?:{
    _id?:string;
     senderUsername?:string;
      receiverUsername?:string
  }
}

export interface IBaseRepository<TInput, TOutput> {
  create(data: TInput): Promise<TOutput>;
  findOne(criteria: TInput): Promise<TOutput>;
  update(id: string, data: TInput): Promise<TOutput>;
  delete(id: string): Promise<boolean>;
}
