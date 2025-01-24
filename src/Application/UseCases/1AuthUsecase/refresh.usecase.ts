import { JwtPayload } from 'jsonwebtoken';
import { User } from '../../../Domain/Entities/User';
import { JwtToken } from '../../../Infrastructure/External-libraries/6-token.ts/token.service';
import { BadRequestError } from '../../../Presentation/Error/errorInterface';
import { findOneByUser } from '../../../Infrastructure/Database/Mongoose/Repositories/UserRespository';


interface IRefreshTokenDTO {
  token: string;
}

export interface IRefreshResult {
  user?: User;
  userArray?: User;
  token?: {
    accessToken?: string;
    refreshToken?: string;
  };
}

export class RefreshUsecase  {
  constructor(private readonly authservice: JwtToken) {}
  public async execute(input: IRefreshTokenDTO): Promise<IRefreshResult> {
    const decodedToken: JwtPayload | string | null = this.authservice.verifyRefreshToken(input.token);

    if (!decodedToken && typeof decodedToken === 'string') {
      throw new BadRequestError('Invalid refresh token', 'OnRefreshToken() method Token error');
    }

    const { userId, email, username } = decodedToken as JwtPayload;

    const foundUser = await findOneByUser({ data: { _id: userId } });

    if (!foundUser || foundUser.isNull || !foundUser.user) {
      throw new BadRequestError('Invalid refresh token', 'OnRefreshToken() method Token error');
    }

    const newAccessToken = await this.authservice.accessTokenGenerator(userId, email, username);

    if (!newAccessToken) {
      throw new BadRequestError('Invalid refresh token', 'OnRefreshToken() method Token error');
    }

    return {
      token: {
        accessToken: newAccessToken
      },
      user: foundUser.user
    };
  }
}
