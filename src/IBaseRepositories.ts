import { Buyer, IBuyer } from "./Entities/Buyer";
import { Message } from "./Entities/Chat";
import { SellerGig } from "./Entities/gig.entity";
import { Seller } from "./Entities/seller.entity";
import { User, IUser } from "./Entities/User";
import { IConversation, IChatData } from "./Interface/IChat.interface";
import { ISellerGig } from "./Interface/IGig.interface";
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
  conversation?:IConversation
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

    
  }

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
