

import { IBaseRepository, IRepoRequest, IRepoResponse } from "../../shared/IBase-repository";






export interface ISellerRepositories extends IBaseRepository<IRepoRequest,IRepoResponse> {
  randomSellers(size:number):Promise<IRepoResponse>
}