export type ImailerDetails = {
  name?: string;
  email?: string;
  subject?:string;
  otp?: string;
  link?: string;
  description?: string;
  html?:string,
  type?:string
};

export interface IMailer {
  SendEmail(data:ImailerDetails): any;
}
