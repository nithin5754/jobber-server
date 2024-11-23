

import { IBaseRepository, IRepoRequest, IRepoResponse } from "../../shared/ibase-repository";






export interface ISellerRepositories extends IBaseRepository<IRepoRequest,IRepoResponse> {
  randomSellers(size:number):Promise<IRepoResponse>
}