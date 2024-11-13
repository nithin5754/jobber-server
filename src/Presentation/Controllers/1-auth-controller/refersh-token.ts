import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../../error/error.interface";
import { IAuthService } from "../../../Interfaces/IAuthService";
import { IToken } from "../../../External-libraries/6-token.ts/IToken.interface";
import { StatusCodes } from "http-status-codes";
import { omit } from "lodash";



export class RefreshToken {
  constructor(private tokenService:IToken,private authService:IAuthService) {
    
  }



  onRefreshToken=async (req: Request, res: Response, next: NextFunction):Promise<any> => {

    try {
      const cookies=req.cookies

      if(!cookies?.jwt){
        throw new BadRequestError('Token expired please login again', 'OnRefreshToken() method Token error');

      }

      const refreshToken=cookies.jwt

      const decodedToken = this.tokenService.verifyRefreshToken(refreshToken);
      if (!decodedToken) {
       
        throw new BadRequestError('Invalid refresh token', 'OnRefreshToken() method Token error');
      }

      const {userId,email,username} = decodedToken;


     const foundUser= await this.authService.getFetchDataById(userId)



     if (!foundUser) {
      throw new BadRequestError('Invalid refresh token', 'OnRefreshToken() method Token error');
    }

    let filterFetch=omit(foundUser,['password'])

  
      const accessToken=await this.tokenService.accessTokenGenerator(userId,email,username)

      if(!accessToken){
        throw new BadRequestError('Invalid refresh token', 'OnRefreshToken() method Token error');
      }

      res.status(StatusCodes.OK).json({message:'access token created new' ,token:accessToken,user:filterFetch})   
    } catch (error) {
      next(error)
    }


  }
}