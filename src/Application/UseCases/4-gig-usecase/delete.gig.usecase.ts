import { deleteGig } from '../../../Infrastructure/Database/Mongoose/Repositories/gig.repository';
import { BadRequestError } from '../../../Presentation/Error/errorInterface';


export interface ISellerGigDeleteDTO {
  gigId: string;
  sellerId: string;
}

export interface ISellerGigDeleteResult {
  isDelete: boolean;
}

export class DeleteGigUsecase {


  public async execute(input: ISellerGigDeleteDTO): Promise<ISellerGigDeleteResult> {
    const isDelete: boolean = await deleteGig({
      gig: {
        _id: input.gigId,
        sellerId: input.sellerId
      }
    });

    if(!isDelete){
      throw new BadRequestError('Not Delete, Something Went Wrong', 'Delete Controller() Error');
    }

    return {
      isDelete:true
    }
  }
}
