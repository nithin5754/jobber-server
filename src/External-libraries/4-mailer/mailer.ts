import config from "../../config";
import { IMailer, ImailerDetails } from "./IMailer";
import nodemailer from 'nodemailer'

export class Mailer implements IMailer {
  private  _host:string= "smtp.gmail.com";
  private _port:number=465;
  private _secure:boolean=true;

 async SendEmail(data:ImailerDetails) {

    const transporter = nodemailer.createTransport({
      host:this._host,
      port: this._port,
      secure: this._secure,
      auth: {
    
        user:config.NODEMAILER_.EMAIL_NODEMAILER,
        pass:config.NODEMAILER_.PASSWORD_NODEMAILER,
      },
    });


    // <h1>Hy ${name}</h1><br><p>Your OTP for the verification is <h2>${otp}</h2></p>

await transporter.sendMail({
      from: config.NODEMAILER_.EMAIL_NODEMAIL_PROVIDER,
      to: `${data.email}`,
      subject: data.subject,
      html:data.html ,
    });

    return true
  }

}