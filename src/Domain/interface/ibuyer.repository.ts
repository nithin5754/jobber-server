import { IBaseRepository, IRepoRequest, IRepoResponse } from "../../shared/IBase-repository";






export interface IBuyerRepositories extends IBaseRepository<IRepoRequest,IRepoResponse> {
  getRandomBuyers(criteria:IRepoRequest): Promise<IRepoResponse>

}