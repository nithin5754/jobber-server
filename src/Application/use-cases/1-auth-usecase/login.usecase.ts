import { date } from 'joi';
import { User } from '../../../Domain/Entities/User';
import { UserRepository } from '../../../Infrastructure/databse/mongoose/Repositories/user.respository';
import { JwtToken } from '../../../Infrastructure/External-libraries/6-token.ts/token.service';
import { BadRequestError } from '../../../Presentation/error/error.interface';
import { firstLetterUpperCase, isEmail, lowerCase } from '../../../Presentation/utils/helper.utils';
import { IUseCase } from '../../../Shared/IUsecase';

interface IUserLoginDTO {
  password: string;
  userId: string;
}

interface IUserLoginResult {
  user?: User;
  userArray?: User;
  token?: {
    accessToken?: string;
    refreshToken?: string;
  };
}

export class LoginUseCase implements IUseCase<IUserLoginDTO, IUserLoginResult> {
  constructor(private readonly userService: UserRepository, private readonly authService: JwtToken) {}

  public async execute(input: IUserLoginDTO): Promise<IUserLoginResult> {
    /** @description {userId either USERNAME or EMAIL } */
    const { userId, password } = input;
    const isValidEmail: boolean = isEmail(userId);

    const user = isValidEmail ? { email: lowerCase(userId) } : { username: firstLetterUpperCase(userId) };

    const existingUser = await this.userService.findOne({ data: user });
    if (!existingUser || existingUser.isNull || !existingUser.user || !existingUser.user.password) {
      throw new BadRequestError('Invalid credentials', 'SignIn read() method error');
    }

    const isPasswordMatch: boolean = await this.authService.passwordCompare(password, existingUser.user.password);

    if (!isPasswordMatch) {
      throw new BadRequestError('Invalid credentials-password not match', 'SignIn read() method error');
    }

    const { accessToken, refreshToken } = await this.generateTokens(existingUser.user);

    return {
      token: {
        accessToken,
        refreshToken
      },
      user: existingUser.user
    };
  }

  private async generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    const tokens = await this.authService.generateToken(user.id as string, user.email as string, user.username as string);

    if (!tokens.accessToken || !tokens.refreshToken) {
      throw new BadRequestError('Token generation failed', 'SignUp token error');
    }

    return tokens;
  }
}
