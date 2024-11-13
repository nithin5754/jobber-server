import moment from 'moment';
import { IUser } from '../../../../Entities/User';
import { IAuthRepository } from '../../../../Interfaces/IAuthRepository';
import { UserModal } from '../models/user.schema';
import { BuyerModal } from '../models/buyer.schema';

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

        otpExpiration: moment(result.otpExpiration).format('MMMM D, YYYY - h:mm A'),
        createdAt: moment(result.createdAt).format('MMMM D, YYYY - h:mm A'),
        updatedAt: moment(result.updatedAt).format('MMMM D, YYYY - h:mm A'),
        passwordResetExpires: moment(result.passwordResetExpires).format('MMMM D, YYYY - h:mm A')
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
 async updateNewPassword(id: string, password: string): Promise<boolean> {
   

      let result=await UserModal.findByIdAndUpdate({_id:id},{$set:{password:password}},{upsert:true})
      
      return !!result
  }
  async authUserByPasswordVerification(token: string): Promise<IUser | undefined> {
    let result=await UserModal.findOne({passwordResetToken:token,passwordResetExpires:{$gt:new Date()}}).select('-password')

    return this.FilterFetchData(result)
  }
  async updatePasswordToken(authId: string, token: string, tokenExpiration: Date): Promise<void> {
    await UserModal.findByIdAndUpdate({ _id: authId},{$set:{ passwordResetToken: token, passwordResetExpires: tokenExpiration }},{ upsert: true });
  }
  async fetchDataById(userId: string): Promise<IUser | undefined> {
    const result = await UserModal.findById({ _id: userId });
    return this.FilterFetchData(result);
  }


  async updateEmailToken(userId: string,email:string, token: string): Promise<void> {
    await UserModal.findOneAndUpdate({ _id: userId,email:email},{$set:{ emailVerificationToken: token }},{ upsert: true });
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
      username: false
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
  
    let filterData:IUser|undefined=this.FilterFetchData(result)

   if(filterData){
    const BuyerInitialDetails = {
      userId:filterData.id,
      purchasedGigs: [],
      

    };
   let buyer= await BuyerModal.create(BuyerInitialDetails)

   }

    return filterData
  }
}
