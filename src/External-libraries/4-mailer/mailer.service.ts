import {  IEmailMessageDetails, IMailer } from "./interface/imailer.interface";
import nodemailer, { Transporter } from "nodemailer";
import Email from 'email-templates'
import path from "path";
import config from "../../config";
import { BadRequestError } from "../../Presentation/Error/errorInterface";



export class Mailer implements IMailer {   
  private _host: string = "smtp.gmail.com";
  private _port: number = 465;
  private _secure: boolean = true;

  async SendEmail({template,receiver,locals}:IEmailMessageDetails) {
      try {
        const smtpTransport:Transporter = nodemailer.createTransport({
          host: this._host,
          port: this._port,
          secure: this._secure,
          auth: {
            user: config.NODEMAILER_.EMAIL_NODEMAILER,
            pass: config.NODEMAILER_.PASSWORD_NODEMAILER,
          },
        });
    
        const email:Email=new Email({
          message:{
            from: `Jobber App ${config.NODEMAILER_.EMAIL_NODEMAILER}`
          },
          send:true,
          preview:false,
          transport:smtpTransport,
          views:{
            root: path.join(__dirname, "emails"),
            options:{
              extension:'ejs'
            }
          },
          juice:true,
          juiceResources:{
            preserveImportant:true,
            webResources:{
              relativeTo:path.join(__dirname,'../dist')
            }
          }
    
        })
    
    
      const res=  await email.send({
          template:template,
          message:{
            to:receiver,
          },
          locals
        })

        console.log("from email",res)
        return true;
      } catch (error) {
      console.log(error)
        throw new BadRequestError(`${error}`, `${error}`);
      }
  }
}
