import config from "../../config";
import { IEmailMessageDetails, IMailer } from "./IMailer";
import nodemailer from "nodemailer";

export class Mailer implements IMailer {
  private _host: string = "smtp.gmail.com";
  private _port: number = 465;
  private _secure: boolean = true;

  async SendEmail(data: IEmailMessageDetails) {
    const transporter = nodemailer.createTransport({
      host: this._host,
      port: this._port,
      secure: this._secure,
      auth: {
        user: config.NODEMAILER_.EMAIL_NODEMAILER,
        pass: config.NODEMAILER_.PASSWORD_NODEMAILER,
      },
    });

    await transporter.sendMail({
      from: config.NODEMAILER_.EMAIL_NODEMAIL_PROVIDER,
      to: `${data.receiverEmail}`,
      subject: data.subject,
      html: data.html,
    });

    return true;
  }
}
