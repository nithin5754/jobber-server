




import { SellerGig } from '../../../Domain/Entities/gig.entity';
import { GigRepository } from '../../../Infrastructure/databse/mongoose/Repositories/gig.repository';
import { BadRequestError } from '../../../Presentation/error/error.interface';
import { IRepoResponse } from '../../../shared/ibase-repository';
import { IUseCase } from '../../../shared/iusecase';

export interface ISellerGigGetByPausedGigsDTO {
  sellerId: string;
}

export interface ISellerGigGetByPausedGigsResult {
  gigArray: SellerGig[];
}

export class GetSellerPausedGigs implements IUseCase<ISellerGigGetByPausedGigsDTO, ISellerGigGetByPausedGigsResult> {
  constructor(private readonly gigService: GigRepository) {}
  public async execute(input: ISellerGigGetByPausedGigsDTO): Promise<ISellerGigGetByPausedGigsResult> {
    const found: IRepoResponse = await this.gigService.find({
      gig: {
        sellerId: input.sellerId,
        active:false
      }
    });

    if (!found || !found.gigArray||found.gigArray.length<1 || !found.isNull) {
      throw new BadRequestError('Not Found, Using PausedGigs', 'GetSellerGigs Controller() Error');
    }

    return {
      gigArray: found.gigArray
    };
  }
}
