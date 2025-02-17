import { IDeliveredWork, IExtendedDelivery, IOffer, IOrderDocument, IOrderEvents, IOrderReview } from '../Interface/IOrder.interface';

export class Order {
  id: string;
  offer: IOffer;
  gigId: string;
  sellerId: string;
  sellerUsername: string;
  sellerImage: string;
  sellerEmail: string;
  gigCoverImage: string;
  gigMainTitle: string;
  gigBasicTitle: string;
  gigBasicDescription: string;
  buyerId: string;
  buyerUsername: string;
  buyerEmail: string;
  buyerImage: string;
  status: string;
  orderId: string;
  invoiceId: string;
  quantity: number;
  price: number;
  requestExtension?: IExtendedDelivery;
  serviceFee?: number;
  requirements?: string;
  approved?: boolean;
  cancelled?: boolean;
  delivered?: boolean;
  approvedAt?: string;
  deliveredWork?: IDeliveredWork[];
  dateOrdered?: string;
  events: IOrderEvents;
  buyerReview?: IOrderReview;
  sellerReview?: IOrderReview;
  paymentIntent?: string;

  constructor(params: IOrderDocument) {
    this.id = params._id.toString();
    this.offer = params.offer;
    this.gigId = params.gigId;
    this.sellerId = params.sellerId;
    this.sellerUsername = params.sellerUsername;
    this.sellerImage = params.sellerImage;
    this.sellerEmail = params.sellerEmail;
    this.gigCoverImage = params.gigCoverImage;
    this.gigMainTitle = params.gigMainTitle;
    this.gigBasicTitle = params.gigBasicTitle;
    this.gigBasicDescription = params.gigBasicDescription;
    this.buyerId = params.buyerId;
    this.buyerUsername = params.buyerUsername;
    this.buyerEmail = params.buyerEmail;
    this.buyerImage = params.buyerImage;
    this.status = params.status;
    this.orderId = params.orderId;
    this.invoiceId = params.invoiceId;
    this.quantity = params.quantity;
    this.price = params.price;
    this.serviceFee = params.serviceFee;
    this.requestExtension = params.requestExtension;
    this.requirements = params.requirements;
    this.approved = params.approved;
    this.cancelled = params.cancelled;
    this.delivered = params.delivered;
    this.approvedAt = params.approvedAt;
    this.deliveredWork = params.deliveredWork;
    this.dateOrdered = params.dateOrdered;
    this.events = params.events;
    this.buyerReview = params.buyerReview;
    this.sellerReview = params.sellerReview;
    this.paymentIntent = params.paymentIntent;
  }
}
