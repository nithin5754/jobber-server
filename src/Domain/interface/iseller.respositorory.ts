import { IBaseRepository, IRepoRequest } from "../../Shared/IBase-repository";
import { IRepoResponse } from "./IUser.repository";









export interface ISellerRepositories extends IBaseRepository<IRepoRequest,IRepoResponse> {
  randomSellers(size:number):Promise<IRepoResponse>
}