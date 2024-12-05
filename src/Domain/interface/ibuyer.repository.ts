import { IBaseRepository, IRepoRequest, IRepoResponse } from "../../shared/ibase-repository";






export interface IBuyerRepositories extends IBaseRepository<IRepoRequest,IRepoResponse> {
  getRandomBuyers(criteria:IRepoRequest): Promise<IRepoResponse>

}