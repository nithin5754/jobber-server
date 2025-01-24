import { updateUsingOtherFieldsBuyer } from "../../Database/Mongoose/Repositories/buyer.repository";
import { createSeller } from "../../Database/Mongoose/Repositories/seller.respository";
import { findOneByUser } from "../../Database/Mongoose/Repositories/UserRespository";
import { Seller } from "../../Entities/seller.entity";
import { IRepoResponse } from "../../IBaseRepositories";
import { ISeller } from "../../Interface/ISeller.interface";
import { BadRequestError } from "../../Presentation/Error/errorInterface";

export interface ISellerCreateDTO {
  sellerParams: ISeller;
}

export interface ISellerCreateResult {
  seller: Seller;
}

export class CreateSellerUseCase  {

  public async execute(input: ISellerCreateDTO): Promise<ISellerCreateResult> {


    const result: IRepoResponse = await createSeller({ seller: input.sellerParams });


    

    if (!result || !result.seller || result.isNull) {
      throw new BadRequestError('Error Occurred Creating Seller Profile', 'CreateSellerUseCase() validation error');
    }

    await updateUsingOtherFieldsBuyer({ buyerFilter: { userId: result.seller.userId }, buyer: { isSeller: true } });

    await this.addUserDetails(result.seller);



    return {
      seller: result.seller
    };
  }

  private async addUserDetails(seller: Seller): Promise<void> {
    const userDetails: IRepoResponse = await findOneByUser({ data: { _id: seller.userId } });

    if (!userDetails) {
      throw new BadRequestError('users not Found', `GetSellerUsecase() Not Found by `);
    }

    seller.username = userDetails.user?.username;
    seller.profilePicture = userDetails.user?.profilePicture;
    seller.profilePublicId = userDetails.user?.profilePublicId;
    seller.country = userDetails.user?.country as string;
    seller.email = userDetails.user?.email;
  }
}
