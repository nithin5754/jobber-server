import { SellerGig } from '../../../Domain/Entities/gig.entity';
import { GigRepository } from '../../../Infrastructure/databse/mongoose/Repositories/gig.repository';
import { IUseCase } from '../../../shared/iusecase';

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
  constructor(private gigService: GigRepository) {}
  execute(input: TopGigViewsDTO): Promise<TopGigViewsResult> {
    throw new Error('Method not implemented.');
  }
}
