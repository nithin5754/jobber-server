import { JwtPayload } from "jsonwebtoken";

export interface ITokenGenerateProps {
  userId: string;
}

export interface IToken {
  generateToken(userId: string,email:string,username:string): {
    accessToken: string;
    refreshToken: string;
  };
  verifyAccessToken(token: string): any;
  verifyRefreshToken(token: string):  string | JwtPayload | null;
  accessTokenGenerator(userId: string,email:string,username:string): string;
  passwordCompare(password:string,existingPassword:string):Promise<boolean>
}



export interface IAuthPayload {
  userId: string;
  username: string;
  email: string;
  iat?: number;
}
