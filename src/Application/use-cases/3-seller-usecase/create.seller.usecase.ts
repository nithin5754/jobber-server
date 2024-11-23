import { Seller } from '../../../Domain/Entities/seller.entity';
import { ISeller } from '../../../Domain/interface/iseller.interface';
import { BuyerRepositories } from '../../../Infrastructure/databse/mongoose/Repositories/buyer.repository';
import { SellerRepository } from '../../../Infrastructure/databse/mongoose/Repositories/seller.respository';
import { UserRepository } from '../../../Infrastructure/databse/mongoose/Repositories/user.respository';
import { BadRequestError } from '../../../Presentation/error/error.interface';
import { IRepoResponse } from '../../../shared/ibase-repository';
import { IUseCase } from '../../../shared/iusecase';

export interface ISellerCreateDTO {
  sellerParams: ISeller;
}

export interface ISellerCreateResult {
  seller: Seller;
}

export class CreateSellerUseCase implements IUseCase<ISellerCreateDTO, ISellerCreateResult> {
  constructor(
    private readonly sellerservice: SellerRepository,
    private readonly buyerservice: BuyerRepositories,
    private readonly userservice: UserRepository
  ) {}
  public async execute(input: ISellerCreateDTO): Promise<ISellerCreateResult> {
    const result: IRepoResponse = await this.sellerservice.create({ seller: input.sellerParams });

 

    if (!result || !result.seller || result.isNull) {
      throw new BadRequestError('Error Occurred Creating Seller Profile', 'CreateSellerUseCase() validation error');
    }

    await this.buyerservice.updateUsingOtherFields({ buyerFilter: { userId: result.seller.userId }, buyer: { isSeller: true } });

    await this.addUserDetails(result.seller);



    return {
      seller: result.seller
    };
  }

  private async addUserDetails(seller: Seller): Promise<void> {
    const userDetails: IRepoResponse = await this.userservice.findOne({ data: { _id: seller.userId } });

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
