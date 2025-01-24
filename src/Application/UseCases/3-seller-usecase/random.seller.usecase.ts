import { Seller } from '../../../Domain/Entities/seller.entity';
import { IRepoResponse } from '../../../IBaseRepositories';
import { randomSellers } from '../../../Infrastructure/Database/Mongoose/Repositories/seller.respository';
import { findOneByUser } from '../../../Infrastructure/Database/Mongoose/Repositories/UserRespository';
import { BadRequestError } from '../../../Presentation/Error/errorInterface';



export interface ISellerRandomDTO {
  size: number;
}

export interface ISellerRandomResult {
  sellerArray: Seller[] | null;
}

export class RandomSellersUsecase  {

  public async execute(input: ISellerRandomDTO): Promise<ISellerRandomResult> {
    const result: IRepoResponse = await randomSellers(input.size);

    if (!result || result.isNull || !result.sellerArray || result.sellerArray.length <= 0) {
      throw new BadRequestError('Sellers not Found', 'RandomSellers() Not Found!');
    }

    await this.addUserDetailsArray(result.sellerArray);

    return {
      sellerArray: result && result.sellerArray && !result.isNull ? result.sellerArray : null
    };
  }

  private async addUserDetailsArray(sellerArray: Seller[]): Promise<void> {
    const sellerArrayDetails = sellerArray.map(async (params: Seller) => {
      const userDetails: IRepoResponse = await findOneByUser({ data: { _id: params.userId } });

      if (!userDetails) {
        throw new BadRequestError('users not Found', `GetSellerUsecase() Not Found sellers}`);
      }

      params.username = userDetails.user?.username;
      params.profilePicture = userDetails.user?.profilePicture;
      params.profilePublicId = userDetails.user?.profilePublicId;
      params.email = userDetails.user?.email;
    });

    await Promise.all(sellerArrayDetails);
  }
}
