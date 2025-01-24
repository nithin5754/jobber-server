import { SellerGig } from '../../../Domain/Entities/gig.entity';

import { Search } from '../../../Infrastructure/Database/Mongoose/Repositories/search.gig.repository';
import { UserRepository } from '../../../Infrastructure/Database/Mongoose/Repositories/UserRespository';
import { BadRequestError } from '../../../Presentation/Error/errorInterface';
import { IRepoResponse } from '../../../Shared/IBaseRepositories';
import { IUseCase } from '../../../Shared/IUsecases';

export interface ISellerGigSearchIdDTO {
  query: string;
  min_price?: string;
  max_price?: string;
  delivery_time?: string;
  ITEM_PER_PAGE: string;
  page: string;
}

export interface ISellerGigSearchIdResult {
  gigArray: SellerGig[];
  totalGigLength: number;
}

export class SearchGigsUsecase implements IUseCase<ISellerGigSearchIdDTO, ISellerGigSearchIdResult> {
  private paginateFilter: SellerGig[] = [];
  private totalLength = 0;
  constructor(private readonly gigSearch: Search, private readonly userservice: UserRepository) {}
  public async execute(input: ISellerGigSearchIdDTO): Promise<ISellerGigSearchIdResult> {
    const found: IRepoResponse = await this.gigSearch.searchGigs({
      query: input.query,
      gig_filter: {
        min_price: input.max_price ? input.max_price : null,
        max_price: input.min_price ? input.min_price : null,
        delivery_time: input.delivery_time ? input.delivery_time : null
      }
    });

    if (found && found.gigArray && found.gigArray.length > 0) {
      this.totalLength = found.gigArray.length;
      console.log(this.totalLength);
      await this.addUserDetails(found.gigArray);

      const page = parseInt(input.page as string, 10) || 1;
      const ITEM_PER_PAGE = parseInt(input.ITEM_PER_PAGE as string, 10) || 8;
      const startIndex = (page - 1) * ITEM_PER_PAGE;
      const endIndex = page * ITEM_PER_PAGE;

      this.paginateFilter = found.gigArray.slice(startIndex, endIndex);
    } else {
      this.paginateFilter = [];
      this.totalLength = 0;
    }

    return {
      gigArray: this.paginateFilter.length > 0 ? this.paginateFilter : [],
      totalGigLength: this.totalLength
      
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
