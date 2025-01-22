
import { GigRepository } from '../../../Infrastructure/databse/mongoose/Repositories/gig.repository';

import { BadRequestError } from '../../../Presentation/error/error.interface';
import { IRepoResponse } from '../../../Shared/IBase-repository';
import { IUseCase } from '../../../Shared/IUsecase';


export interface ISellerGigUpdateDTO {
  id: string;
  active: boolean;
}

export interface ISellerGigUpdateResult {}

export class updateActiveGigUsecase implements IUseCase<ISellerGigUpdateDTO, ISellerGigUpdateResult> {
  constructor(private readonly gigService: GigRepository) {}
  public async execute(input: ISellerGigUpdateDTO): Promise<ISellerGigUpdateResult> {
    await this.processGigUpdate(input);

    return {};
  }

  private async processGigUpdate(input: ISellerGigUpdateDTO): Promise<void> {
    const { id, active } = input;

    const result: IRepoResponse = await this.gigService.update(id, { gig: { active } });

    if (!result || result.isNull) {
      throw new BadRequestError('Failed to create gig', 'Seller Gig update error');
    }
  }
}
