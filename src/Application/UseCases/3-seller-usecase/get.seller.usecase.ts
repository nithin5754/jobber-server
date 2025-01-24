
import { Seller } from '../../../Domain/Entities/seller.entity';

import { SellerRepository } from '../../../Infrastructure/Database/Mongoose/Repositories/seller.respository';
import { UserRepository } from '../../../Infrastructure/Database/Mongoose/Repositories/UserRespository';
import { BadRequestError } from '../../../Presentation/Error/errorInterface';
import { IRepoResponse } from '../../../Shared/IBaseRepositories';
import { IUseCase } from '../../../Shared/IUseCases';

export interface ISellerGetDTO {
  userId?: string;
  username?: string;
  _id?:string;
}

export interface ISellerGetResult {
  seller: Seller | null;
}

export class GetSellerUsecase implements IUseCase<ISellerGetDTO, ISellerGetResult> {
  constructor(private readonly sellerservice: SellerRepository, private readonly userRepository: UserRepository) {}
  public async execute(input: ISellerGetDTO): Promise<ISellerGetResult> {
    const result: IRepoResponse | null = await this.sellerservice.findOne({ seller: input });

    if (!result || result.isNull || !result.seller) {
      throw new BadRequestError('Sellers not Found', `GetSellerUsecase() Not Found by ${input.userId || input.username||input._id}`);
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
    const userDetails: IRepoResponse = await this.userRepository.findOne({ data: { _id: seller.userId } });

    if (!userDetails) {
      throw new BadRequestError('users not Found', `GetSellerUsecase() Not Found by ${input.userId || input.username}`);
    }

    seller.username = userDetails.user?.username;
    seller.profilePicture = userDetails.user?.profilePicture;
    seller.profilePublicId = userDetails.user?.profilePublicId;
    seller.country=userDetails.user?.country as string
    seller.email = userDetails.user?.email;
  }
}
