
import { compare, genSalt, hash } from "bcryptjs";
import config from "../../../config";
import {  IToken } from "./IToken.interface";

import jwt from "jsonwebtoken";

export class JwtToken implements IToken {

  private readonly jwt_key: string = config.JWT_.ACCESS_TOKEN;

  private readonly refresh_token: string = config.JWT_.REFRESH_TOKEN;

  generateToken(userId: string,email:string,username:string): { accessToken: string; refreshToken: string } {
    const accessToken: string = jwt.sign({userId,email,username}, this.jwt_key, {
      expiresIn: "1d",
    });

    const refreshToken: string = jwt.sign({userId,email,username}, this.refresh_token, {
      expiresIn: "7d",
    });
    return {
      accessToken,
      refreshToken,
    };
  }
  verifyAccessToken(token: string) {
    return jwt.verify(token, this.jwt_key);
  }
  verifyRefreshToken(token: string): string | jwt.JwtPayload | null {
    try {
      return jwt.verify(token, this.refresh_token);
    } catch (error) {
      console.error('Token verification failed:', error);
      return null; 
    }
  }
  accessTokenGenerator(userId: string,email:string,username:string): string {
    const accessToken: string = jwt.sign({userId,email,username}, this.jwt_key, {
      expiresIn: "7d",
    });

    return accessToken;
  }


  public async passwordCompare(password: string, existingPassword: string): Promise<boolean> {
     return !! await compare(password,existingPassword)
  }


  public async hashing(password:string):Promise<string>{
    const salt = await genSalt();
    const hashPassword:string = await hash(password , salt);

    return hashPassword
  }
}
