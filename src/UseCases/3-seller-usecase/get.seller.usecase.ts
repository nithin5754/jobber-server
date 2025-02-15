import { findOneSeller } from '../../Database/Mongoose/Repositories/seller.respository';
import { findOneByUser } from '../../Database/Mongoose/Repositories/user.respository';
import { Seller } from '../../Entities/Seller';
import { IRepoResponse } from '../../IBaseRepositories';
import { BadRequestError } from '../../Presentation/Error/errorInterface';

export interface ISellerGetDTO {
  userId?: string;
  username?: string;
  _id?: string;
}

export interface ISellerGetResult {
  seller: Seller | null;
}

export class GetSellerUsecase {
  public async execute(input: ISellerGetDTO): Promise<ISellerGetResult> {
    const result: IRepoResponse | null = await findOneSeller({ seller: input });

    if (!result || result.isNull || !result.seller) {
      throw new BadRequestError('Sellers not Found', `GetSellerUsecase() Not Found by ${input.userId || input.username || input._id}`);
    }

    await this.addUserDetails(result.seller, input);

    return result && result.seller
      ? {
          seller: result.seller
        }
      : {
          seller: null
        };
  }

  private async addUserDetails(seller: Seller, input: ISellerGetDTO): Promise<void> {
    const userDetails: IRepoResponse = await findOneByUser({ data: { _id: seller.userId } });

    if (!userDetails) {
      throw new BadRequestError('users not Found', `GetSellerUsecase() Not Found by ${input.userId || input.username}`);
    }

    seller.username = userDetails.user?.username;
    seller.profilePicture = userDetails.user?.profilePicture;
    seller.profilePublicId = userDetails.user?.profilePublicId;
    seller.country = userDetails.user?.country as string;
    seller.email = userDetails.user?.email;
  }
}
