import { updateUsingOtherFilterSeller } from "../../Database/Mongoose/Repositories/seller.respository";
import { findOneByUser } from "../../Database/Mongoose/Repositories/user.respository";
import { Seller } from "../../Entities/Seller";
import { IRepoResponse } from "../../IBaseRepositories";
import { ISeller } from "../../Interface/ISeller.interface";
import { BadRequestError } from "../../Presentation/Error/errorInterface";


export interface ISellerUpdateDTO {
  filter: string;
  sellerParams: ISeller;
}

export interface ISellerUpdateResult {
  seller: Seller;
}

export class UpdateSellerUsecase  {

  public async execute(input: ISellerUpdateDTO): Promise<ISellerUpdateResult> {
    const updatedSeller: IRepoResponse = await updateUsingOtherFilterSeller({
      sellerFilter: { _id: input.filter },
      seller: input.sellerParams
    });

    if (!updatedSeller || updatedSeller.isNull || !updatedSeller.seller) {
      throw new BadRequestError('Error Occurred UpdatingSeller Profile', 'UpdateSellerUsecase() validation error');
    }

    await this.addUserDetails(updatedSeller.seller, input);

    return {
      seller: updatedSeller.seller
    };
  }

  private async addUserDetails(seller: Seller, input: ISellerUpdateDTO): Promise<void> {
    const userDetails: IRepoResponse = await findOneByUser({ data: { _id: seller.userId } });

    if (!userDetails) {
      throw new BadRequestError(
        'users not Found',
        `UpdateSellerUsecase() Not Found by ${input.sellerParams._id || input.sellerParams.username}`
      );
    }

    seller.username = userDetails.user?.username;
    seller.profilePicture = userDetails.user?.profilePicture;
    seller.profilePublicId = userDetails.user?.profilePublicId;
    seller.country = userDetails.user?.country as string;
    seller.email = userDetails.user?.email;
  }
}
