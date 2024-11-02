import { IUser } from "../Entities/User";









export interface  IAuthRepository {
  createAuthUser(data:IUser):Promise<IUser|undefined>
 getUserByUsernameOrEmail(email:string,username:string):Promise<boolean>


}