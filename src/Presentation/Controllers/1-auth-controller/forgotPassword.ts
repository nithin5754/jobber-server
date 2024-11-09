import { NextFunction, Request, Response } from 'express';
import { IAuthService } from '../../../Interfaces/IAuthService';
import { forgotPasswordSchema, passwordSchema } from '../../schemas/1-auth-schemas/passwordSchema';
import { BadRequestError } from '../../error/error.interface';
import { IUser } from '../../../Entities/User';
import config from '../../../config';
import { IEmailMessageDetails } from '../../../External-libraries/4-mailer/interface/IMailer';
import { StatusCodes } from 'http-status-codes';
import { genSalt, hash } from 'bcryptjs';

export class ForgotPassword {
  constructor(private authservice: IAuthService) {}

  forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      let { error } = (await Promise.resolve(forgotPasswordSchema)).validate(req.body);
      const { email } = req.body;

      if (error) {
        throw new BadRequestError(error.details[0].message, 'ForgotPassword forgotPassword() method error');
      }

      let checkUserExist: IUser | undefined = await this.authservice.fetchUserDetails(email, 'email');

      if (!checkUserExist || typeof checkUserExist === 'undefined') {
        throw new BadRequestError('Error .User not found', 'ForgotPassword forgotPassword() method error');
      }

      let randomBytes: Buffer = await this.authservice.createRandomBytes();

      const randomCharacters: string = randomBytes.toString('hex');
      const date: Date = new Date();
      date.setHours(date.getHours() + 1);
      const resetPasswordLink = `${config.URL_.CLIENT_URL}/forgot-password?v_token=${randomCharacters}`;

      await this.authservice.getUpdatePasswordToken(checkUserExist.id as string, randomCharacters, date);

      const messageDetails: IEmailMessageDetails = {
        template: 'forgotPassword',
        receiver: checkUserExist.email as string,
        locals: {
          appLink: `${config.URL_.CLIENT_URL}`,
          appIcon: 'https://i.ibb.co/Kyp2m0t/cover.png',
          resetLink: resetPasswordLink,
          username: checkUserExist.username as string
        }
      };
      await this.authservice.SendEmail(messageDetails);
      res.status(StatusCodes.OK).json({ message: 'Password reset email sent.' });
    } catch (error) {
      next(error);
    }
  };
  resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { error } = (await Promise.resolve(passwordSchema)).validate(req.body);

    if (error) {
      throw new BadRequestError(error.details[0].message, 'Password resetPassword() method error');
    }

    const { password, confirmPassword } = req.body;

    const { token } = req.params;

    if (password !== confirmPassword) {
      throw new BadRequestError('Passwords do not match', 'Password resetPassword() method error');
    }

    const existingUser: IUser | undefined = await this.authservice.getUserByPasswordVerification(token);

    if (!existingUser) {
      throw new BadRequestError('Reset token has expired', 'Password resetPassword() method error');
    }

    const salt = await genSalt();
 const hashPassword:string = await hash(password , salt);

    const isUpdatePassword: boolean = await this.authservice.getUpdateNewPassword(existingUser.id as string, hashPassword);

    if (!isUpdatePassword) {
      throw new BadRequestError('error while reset password', 'Password resetPassword() method error');
    }

    res.status(StatusCodes.OK).json({ message: ' Password Reset Successfully' });
  };
}
