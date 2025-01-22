import { IBaseRepository, IRepoRequest } from "../../Shared/IBase-repository";
import { IRepoResponse } from "./IUser.repository";






export interface IBuyerRepositories extends IBaseRepository<IRepoRequest,IRepoResponse> {
  getRandomBuyers(criteria:IRepoRequest): Promise<IRepoResponse>

}