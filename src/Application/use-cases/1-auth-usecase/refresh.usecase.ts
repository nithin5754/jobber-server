import { JwtPayload } from 'jsonwebtoken';
import { User } from '../../../Domain/Entities/User';
import { UserRepository } from '../../../Infrastructure/databse/mongoose/Repositories/user.respository';
import { JwtToken } from '../../../Infrastructure/External-libraries/6-token.ts/token.service';
import { BadRequestError } from '../../../Presentation/error/error.interface';
import { IUseCase } from '../../../shared/iusecase';

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

export class RefreshUsecase implements IUseCase<IRefreshTokenDTO, IRefreshResult> {
  constructor(private readonly authservice: JwtToken, private readonly userService: UserRepository) {}
  public async execute(input: IRefreshTokenDTO): Promise<IRefreshResult> {
    const decodedToken: JwtPayload | string | null = this.authservice.verifyRefreshToken(input.token);

    if (!decodedToken && typeof decodedToken === 'string') {
      throw new BadRequestError('Invalid refresh token', 'OnRefreshToken() method Token error');
    }

    const { userId, email, username } = decodedToken as JwtPayload;

    const foundUser = await this.userService.findOne({ data: { _id: userId } });

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
