export interface ITokenGenerateProps {
  userId: string;
}

export interface IToken {
  generateToken(userId: string,email:string,username:string): {
    accessToken: string;
    refreshToken: string;
  };
  verifyAccessToken(token: string): any;
  verifyRefreshToken(token: string): any;
  accessTokenGenerator(userId: string,email:string,username:string): string;
}



export interface IAuthPayload {
  userId: string;
  username: string;
  email: string;
  iat?: number;
}
