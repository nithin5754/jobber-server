import { Request, Response, NextFunction } from "express";
import { IController } from "../../../shared/IController";
import { BadRequestError } from "../../error/error.interface";
import { CurrentUserUsecase, ICurrentUserResult } from "../../../Application/use-cases/1-auth-usecase/current-user.usecase";
import { User } from "../../../Domain/Entities/User";
import { UserTypeKey } from "../../../Domain/interface/iuser.interface";
import { omit } from "lodash";
import { StatusCodes } from "http-status-codes";




export class CurrentUser implements IController {
  constructor(
    private readonly currentUsecase:CurrentUserUsecase
  ) {
    
  }
public async  handle(req: Request, res: Response, next: NextFunction): Promise<void> {
      await this.validateRequest(req)

  const userId:string=  req.currentUser.userId


  const result:ICurrentUserResult=await this.currentUsecase.execute({userId})

  if(!result){
    throw new BadRequestError('Current User Credentials missing please login ', 'CurrentUser() method  error');
  }


  res.status(StatusCodes.OK).json({ message: 'user successfully authorized', user:this.sanitizeTheData(result.user,['password','emailVerificationToken','browserName','deviceType','otp','otpExpiration','updatedAt','passwordResetExpires','passwordResetToken']) });



  }


  private async validateRequest(req: Request): Promise<void> {
    if (!req.currentUser.userId) {
      throw new BadRequestError('Current User Credentials missing please login ', 'CurrentUser() method  error');
    }
  }

  private sanitizeTheData(data: User, RemoveItem: UserTypeKey[]): User {
    return omit(data, RemoveItem) as User;
  }
}