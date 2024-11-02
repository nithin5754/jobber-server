import moment from "moment";
import { IUser } from "../../../../Entities/User";
import { IAuthRepository } from "../../../../Interfaces/IAuthRepository";

import { UserModal } from "../models/user.schema";

export class AuthRepository implements IAuthRepository {
  constructor() {}
 async getUserByUsernameOrEmail(email:string,username:string): Promise<boolean> {
     
    let result=await UserModal.findOne({$or:[{email:email},{username:username}]})

    return !!result
  }
  async createAuthUser(data: IUser): Promise<IUser | undefined> {
    let result = await UserModal.create(data);
   
    if (!result) return undefined;

    let fetchData: IUser = {
      id: result._id.toString() as string,
      profilePublicId: result.profilePublicId,
      username: result.username,
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

    return fetchData;
  }
}
