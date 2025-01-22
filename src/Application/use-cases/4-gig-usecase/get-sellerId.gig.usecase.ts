import { SellerGig } from '../../../Domain/Entities/gig.entity';
import { GigRepository } from '../../../Infrastructure/Databse/Mongoose/Repositories/gig.repository';
import { UserRepository } from '../../../Infrastructure/Databse/Mongoose/Repositories/user.respository';
import { BadRequestError } from '../../../Presentation/Error/error.interface';
import { IRepoResponse } from '../../../Shared/IBaseRepository';
import { IUseCase } from '../../../Shared/IUsecase';

export interface ISellerGigGetBySellerIdDTO {
  sellerId: string;
}

export interface ISellerGigGetBySellerIdResult {
  gigArray: SellerGig[];
}

export class GetSellerGigs implements IUseCase<ISellerGigGetBySellerIdDTO, ISellerGigGetBySellerIdResult> {
  constructor(private readonly gigService: GigRepository,
    private readonly userservice:UserRepository
  ) {}
  public async execute(input: ISellerGigGetBySellerIdDTO): Promise<ISellerGigGetBySellerIdResult> {
    const found: IRepoResponse = await this.gigService.find({
      gig: {
        sellerId: input.sellerId,
        active:true 
      }
    });



    if (!found || !found.gigArray || found.isNull||found.gigArray.length<1) {
      throw new BadRequestError('Not Found, Using SellerId', 'GetSellerGigs Controller() Error');
    }
await this.addUserDetails(found.gigArray)

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
