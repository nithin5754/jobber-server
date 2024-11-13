import config from "../../config";
import { IToken } from "./IToken.interface";

import jwt from "jsonwebtoken";

export class JwtToken implements IToken {
  private readonly jwt_key: string = config.JWT_.ACCESS_TOKEN;

  private readonly refresh_token: string = config.JWT_.REFRESH_TOKEN;

  generateToken(userId: string,email:string,username:string): { accessToken: string; refreshToken: string } {
    const accessToken: string = jwt.sign({userId,email,username}, this.jwt_key, {
      expiresIn: "1m",
    });

    const refreshToken: string = jwt.sign({userId,email,username}, this.refresh_token, {
      expiresIn: "1d",
    });
    return {
      accessToken,
      refreshToken,
    };
  }
  verifyAccessToken(token: string) {
    return jwt.verify(token, this.jwt_key);
  }
  verifyRefreshToken(token: string) {
    return jwt.verify(token, this.refresh_token);
  }
  accessTokenGenerator(userId: string,email:string,username:string): string {
    const accessToken: string = jwt.sign({userId,email,username}, this.jwt_key, {
      expiresIn: "1m",
    });

    return accessToken;
  }
}
