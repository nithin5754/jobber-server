



import { IUser } from "../Entities/User";









export interface  IAuthService {
  create(data:IUser):Promise<IUser|undefined>
  usernameOrEmail(email:string,username:string):Promise<boolean>
}