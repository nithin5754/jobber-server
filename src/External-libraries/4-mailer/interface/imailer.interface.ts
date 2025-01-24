


// export interface IEmailMessageDetails {
//   receiverEmail?:string;
//   subject?:string;
//   verifyLink?:string;
//   resetLink?:string;
//   username?:string;
//   otp?:string;
//   description?:string;
//   html?:string;
//   type?:string;
// }


export interface IEmailLocals {
  sender?: string;
  appLink: string;
  appIcon: string;
  offerLink?: string;
  amount?: string;
  buyerUsername?: string;
  sellerUsername?: string;
  title?: string;
  description?: string;
  deliveryDays?: string;
  orderId?: string;
  orderDue?: string;
  requirements?: string;
  orderUrl?: string;
  originalDate?: string;
  newDate?: string;
  reason?: string;
  subject?: string;
  header?: string;
  type?: string;
  message?: string;
  serviceFee?: string;
  total?: string;
  username?: string;
  verifyLink?: string;
  resetLink?: string;
  otp?: string;
}


export interface IEmailMessageDetails {
  template:string;
  receiver:string
  locals:IEmailLocals
}



export interface IMailer {
  SendEmail(data:IEmailMessageDetails): any;
}
