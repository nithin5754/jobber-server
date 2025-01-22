import { IBaseRepository, IRepoRequest } from "../../Shared/IBaseRepository";
import { IRepoResponse } from "./IUser.repository";






export interface IBuyerRepositories extends IBaseRepository<IRepoRequest,IRepoResponse> {
  getRandomBuyers(criteria:IRepoRequest): Promise<IRepoResponse>

}