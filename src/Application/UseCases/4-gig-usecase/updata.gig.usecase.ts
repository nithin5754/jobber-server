import { SellerGig } from '../../../Domain/Entities/gig.entity';
import { ISellerGig } from '../../../Domain/Interface/IGig.interface';
import { IRepoResponse } from '../../../IBaseRepositories';
import { updateGIG } from '../../../Infrastructure/Database/Mongoose/Repositories/gig.repository';
import { findOneByUser } from '../../../Infrastructure/Database/Mongoose/Repositories/UserRespository';
import { BadRequestError } from '../../../Presentation/Error/errorInterface';

export interface ISellerGigUpdateDTO {
  id: string;
  data: ISellerGig;
  coverImage?: Express.Multer.File;
}

export interface ISellerGigUpdateResult {
  gig: SellerGig;
}

export class UpdateGigUsecase {
  public async execute(input: ISellerGigUpdateDTO): Promise<ISellerGigUpdateResult> {
    const result: SellerGig = await this.processGigUpdate(input);

    return {
      gig: result
    };
  }

  private async processGigUpdate(input: ISellerGigUpdateDTO): Promise<SellerGig> {
    const { data, id } = input;

    const result: IRepoResponse = await updateGIG(id, { gig: data });

    if (!result || !result.gig) {
      throw new BadRequestError('users not Found ', `Editing UpdateGigUsecase() Not Found by `);
    }

    await this.addUserDetails(result.gig);

    return result.gig;
  }

  private async addUserDetails(gig: SellerGig): Promise<void> {
    const userDetails: IRepoResponse = await findOneByUser({ data: { _id: gig.userId } });

    if (!userDetails) {
      throw new BadRequestError('users not Found', `Get User Gig Usecase() Not Found by `);
    }

    gig.username = userDetails.user?.username;
    gig.profilePicture = userDetails.user?.profilePicture;
    gig.email = userDetails.user?.email;
  }
}
