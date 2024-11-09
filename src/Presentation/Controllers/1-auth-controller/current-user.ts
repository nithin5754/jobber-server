import { NextFunction, Request, Response } from 'express';
import { BadRequestError } from '../../error/error.interface';
import { IUser } from '../../../Entities/User';
import { IAuthService } from '../../../Interfaces/IAuthService';
import { StatusCodes } from 'http-status-codes';
import { omit } from 'lodash';

export class CurrentUser {
  constructor(private authservice: IAuthService) {}

  currentUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    console.log(req.userId,"hello")
    try {
      let user: IUser | null = null;


      let isCurrentUserExist: IUser | undefined = await this.authservice.getFetchDataById(req.userId);

      if (isCurrentUserExist && Object.keys(isCurrentUserExist).length) {
        let fetchUser: IUser = omit(isCurrentUserExist, ['password']);
        user = fetchUser;
      }

      res.status(StatusCodes.OK).json({ message: 'user successfully authorized', user });
    } catch (error) {
      next(error);
    }
  };
}
