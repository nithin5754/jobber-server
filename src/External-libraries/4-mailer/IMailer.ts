


export interface IEmailMessageDetails {
  receiverEmail?:string;
  subject?:string;
  verifyLink?:string;
  resetLink?:string;
  username?:string;
  otp?:string;
  description?:string;
  html?:string;
  type?:string;
}



export interface IMailer {
  SendEmail(data:IEmailMessageDetails): any;
}
