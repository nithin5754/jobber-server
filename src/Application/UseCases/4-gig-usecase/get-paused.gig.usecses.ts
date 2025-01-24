import { SellerGig } from '../../../Domain/Entities/gig.entity';
import { IRepoResponse } from '../../../IBaseRepositories';
import { findGIG } from '../../../Infrastructure/Database/Mongoose/Repositories/gig.repository';
import { findOneByUser } from '../../../Infrastructure/Database/Mongoose/Repositories/UserRespository';
import { BadRequestError } from '../../../Presentation/Error/errorInterface';


export interface ISellerGigGetByPausedGigsDTO {
  sellerId: string;
}

export interface ISellerGigGetByPausedGigsResult {
  gigArray: SellerGig[];
}

export class GetSellerPausedGigs  {

  public async execute(input: ISellerGigGetByPausedGigsDTO): Promise<ISellerGigGetByPausedGigsResult> {
    const found: IRepoResponse = await findGIG({
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
        const userDetails: IRepoResponse = await findOneByUser({ data: { _id: item[i].userId } });

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
