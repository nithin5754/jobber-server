import { IUser } from '../Entities/User';

export interface IAuthRepository {
  createAuthUser(data: IUser): Promise<IUser | undefined>;
  getUserByUsernameOrEmail(
    email: string,
    username: string
  ): Promise<{
    email: boolean;
    username: boolean;
  }>;

  fetchDataByUsername(username: string): Promise<IUser | undefined>;
  fetchDataByEmail(email: string): Promise<IUser | undefined>;
  authUserByEmailVerification(token: string): Promise<IUser | undefined>;

  authUserByPasswordVerification(token: string): Promise<IUser | undefined>;

  updateVerifyEmailField(id: string, data: boolean): Promise<void>;
  updateNewPassword(id: string, password: string): Promise<boolean>;

  fetchDataById(userId: string): Promise<IUser | undefined>;

  updatePasswordToken(authId: string, token: string, tokenExpiration: Date): Promise<void>;
}
