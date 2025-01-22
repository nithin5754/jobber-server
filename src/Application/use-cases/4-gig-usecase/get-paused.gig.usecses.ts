import { SellerGig } from '../../../Domain/Entities/gig.entity';
import { GigRepository } from '../../../Infrastructure/databse/mongoose/Repositories/gig.repository';
import { UserRepository } from '../../../Infrastructure/databse/mongoose/Repositories/user.respository';
import { BadRequestError } from '../../../Presentation/error/error.interface';
import { IRepoResponse } from '../../../Shared/IBase-repository';
import { IUseCase } from '../../../Shared/IUsecase';

export interface ISellerGigGetByPausedGigsDTO {
  sellerId: string;
}

export interface ISellerGigGetByPausedGigsResult {
  gigArray: SellerGig[];
}

export class GetSellerPausedGigs implements IUseCase<ISellerGigGetByPausedGigsDTO, ISellerGigGetByPausedGigsResult> {
  constructor(private readonly gigService: GigRepository, private readonly userservice: UserRepository) {}
  public async execute(input: ISellerGigGetByPausedGigsDTO): Promise<ISellerGigGetByPausedGigsResult> {
    const found: IRepoResponse = await this.gigService.find({
      gig: {
        sellerId: input.sellerId,
        active: false
      }
    });

    if (!found || !found.gigArray || found.gigArray.length < 1 || found.isNull) {
      throw new BadRequestError('Not Found, Using PausedGigs', 'GetSellerGigs Controller() Error');
    }

    await this.addUserDetails(found.gigArray);

    return {
      gigArray: found.gigArray
    };
  }

  private async addUserDetails(item: SellerGig[]): Promise<void> {
    for (let i = 0; i < item.length; i++) {
      {
        const userDetails: IRepoResponse = await this.userservice.findOne({ data: { _id: item[i].userId } });

        if (!userDetails) {
          throw new BadRequestError('users not Found', `Get User Gig Usecase() Not Found by `);
        }

        item[i].username = userDetails.user?.username;
        item[i].profilePicture = userDetails.user?.profilePicture;
        item[i].email = userDetails.user?.email;
      }
    }
  }
}
