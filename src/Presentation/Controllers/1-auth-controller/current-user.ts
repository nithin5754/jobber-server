import { NextFunction, Request, Response } from 'express';
import { BadRequestError } from '../../error/error.interface';
import { IUser } from '../../../Entities/User';
import { IAuthService } from '../../../Interfaces/IAuthService';
import { StatusCodes } from 'http-status-codes';
import { omit } from 'lodash';
import { lowerCase } from '../../utils/helper.utils';
import config from '../../../config';
import { IEmailMessageDetails } from '../../../External-libraries/4-mailer/interface/IMailer';

export class CurrentUser {
  constructor(private authservice: IAuthService) {}

  currentUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    console.log(req.currentUser.userId,"hello")
    try {
      let user: IUser | null = null;

      console.log(req.session,"hell0")
      let isCurrentUserExist: IUser | undefined = await this.authservice.getFetchDataById(req.currentUser.userId);

      if (isCurrentUserExist && Object.keys(isCurrentUserExist).length) {
        let fetchUser: IUser = omit(isCurrentUserExist, ['password']);
        user = fetchUser;
      }

      res.status(StatusCodes.OK).json({ message: 'user successfully authorized', user });
    } catch (error) {
      next(error);
    }
  };


  resendEmail=async(req:Request,res:Response,next:NextFunction):Promise<any>=>{
    try {
      const {email}=req.body 

      const userId=req.currentUser.userId

      if(!userId||!email){
         throw new BadRequestError("Credentials not found.Error","ResendEmail() error Credentials");
        
      }

      let isCurrentUserExist:IUser|undefined=await this.authservice.fetchUserDetails(lowerCase(email),'email')

     if(!isCurrentUserExist||isCurrentUserExist.id!==userId){
      throw new BadRequestError("user not found","ResendEmail() error")
     }






     let randomBytes: Buffer = await this.authservice.createRandomBytes();

     const randomCharacters: string = randomBytes.toString('hex');


await this.authservice.getUpdateEmailToken(isCurrentUserExist.id as string,isCurrentUserExist.email as string,randomCharacters)


const verificationLink = `${config.URL_.CLIENT_URL}/confirm_email?v_token=${randomCharacters}`;

if (isCurrentUserExist && isCurrentUserExist.username) {
  const messageDetails: IEmailMessageDetails = {
    template: 'emailVerification',
    receiver: isCurrentUserExist.email as string,
    locals: {
      appLink: `${config.URL_.CLIENT_URL}`,
      appIcon: 'https://i.ibb.co/Kyp2m0t/cover.png',
      verifyLink: verificationLink,
      username: isCurrentUserExist.username as string
    }
  };

  await this.authservice.SendEmail(messageDetails);
}


res.status(StatusCodes.OK).json({message:'Resend Email Successfully Send'})

           
    } catch (error) {
      
    }
  }
}
