import { SellerGig } from '../../../Domain/Entities/gig.entity';

import { IUseCase } from '../../../Shared/IUsecase';

export interface TopGigViewsDTO {
  categories: string;
  tags: string[];
  subCategories: string[];
  expectedDelivery: string;
}

export interface TopGigViewsResult {
  topGig: SellerGig[];
  topGigLength: number;
}

export class TopGigUsecase implements IUseCase<TopGigViewsDTO, TopGigViewsResult> {
  constructor() {}
  execute(_input: TopGigViewsDTO): Promise<TopGigViewsResult> {
    throw new Error('Method not implemented.');
  }
}
