import { Seller } from '../../../Domain/Entities/seller.entity';
import { ISeller } from '../../../Domain/interface/iseller.interface';
import { SellerRepository } from '../../../Infrastructure/databse/mongoose/Repositories/seller.respository';
import { UserRepository } from '../../../Infrastructure/databse/mongoose/Repositories/user.respository';
import { BadRequestError } from '../../../Presentation/error/error.interface';
import { IRepoResponse } from '../../../shared/ibase-repository';
import { IUseCase } from '../../../shared/iusecase';

export interface ISellerUpdateDTO {
  sellerParams: ISeller;
}

export interface ISellerUpdateResult {
  seller: Seller;
}

export class UpdateSellerUsecase implements IUseCase<ISellerUpdateDTO, ISellerUpdateResult> {
  constructor(private readonly sellerservice: SellerRepository, private readonly userservice: UserRepository) {}
  public async execute(input: ISellerUpdateDTO): Promise<ISellerUpdateResult> {
    const updatedSeller: IRepoResponse = await this.sellerservice.updateUsingOtherFilter({
      sellerFilter: { _id: input.sellerParams._id },
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
    const userDetails: IRepoResponse = await this.userservice.findOne({ data: { _id: seller.userId } });

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
