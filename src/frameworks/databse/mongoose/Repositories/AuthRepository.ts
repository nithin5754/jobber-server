import moment from "moment";
import { IUser } from "../../../../Entities/User";
import { IAuthRepository } from "../../../../Interfaces/IAuthRepository";
import { UserModal } from "../models/user.schema";

export class AuthRepository implements IAuthRepository {
  private FilterFetchData(result: any): IUser | undefined {
    if (result) {
      let fetchData: IUser = {
        id: result._id.toString() as string,
        profilePublicId: result.profilePublicId,
        username: result.username,
        password: result.password,
        email: result.email,
        country: result.country,
        profilePicture: result.profilePicture,
        emailVerified: result.emailVerified,

        otpExpiration: moment(result.otpExpiration).format(
          "MMMM D, YYYY - h:mm A"
        ),
        createdAt: moment(result.createdAt).format("MMMM D, YYYY - h:mm A"),
        updatedAt: moment(result.updatedAt).format("MMMM D, YYYY - h:mm A"),
        passwordResetExpires: moment(result.passwordResetExpires).format(
          "MMMM D, YYYY - h:mm A"
        ),
      };

      if (result.browserName) {
        fetchData.browserName = result.browserName;
      }

      if (result.deviceType) {
        fetchData.deviceType = result.deviceType;
      }
      return fetchData as IUser;
    }

    return undefined;
  }

  constructor() {}
  async fetchDataById(userId: string): Promise<IUser | undefined> {
    const result = await UserModal.findById({ _id: userId });
    return this.FilterFetchData(result);
  }
  async updateVerifyEmailField(id: string, data: boolean): Promise<void> {
    await UserModal.findByIdAndUpdate({ _id: id }, { emailVerified: data });
  }

  async authUserByEmailVerification(token: string): Promise<IUser | undefined> {
    const result = await UserModal.findOne({ emailVerificationToken: token });
    return this.FilterFetchData(result);
  }
  async fetchDataByUsername(username: string): Promise<IUser | undefined> {
    const result = await UserModal.findOne({ username });
    return this.FilterFetchData(result);
  }
  async fetchDataByEmail(email: string): Promise<IUser | undefined> {
    const result = await UserModal.findOne({ email });

    return this.FilterFetchData(result);
  }
  async getUserByUsernameOrEmail(
    email: string,
    username: string
  ): Promise<{
    email: boolean;
    username: boolean;
  }> {
    let totalResult: {
      email: boolean;
      username: boolean;
    } = {
      email: false,
      username: false,
    };

    let result_email = await UserModal.findOne({ email: email });
    let result_username = await UserModal.findOne({ username: username });
    if (result_email) {
      totalResult.email = true;
    }

    if (result_username) {
      totalResult.username = true;
    }

    return totalResult;
  }
  async createAuthUser(data: IUser): Promise<IUser | undefined> {
    let result = await UserModal.create(data);

    return this.FilterFetchData(result);
  }
}
