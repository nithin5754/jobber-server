import { IBaseRepository, IRepoRequest } from "../../Shared/IBaseRepositories";
import { IRepoResponse } from "./IUser.repository";









export interface ISellerRepositories extends IBaseRepository<IRepoRequest,IRepoResponse> {
  randomSellers(size:number):Promise<IRepoResponse>
}