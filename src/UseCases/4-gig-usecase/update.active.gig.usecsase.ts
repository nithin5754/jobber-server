import { updateGIG } from "../../Database/Mongoose/Repositories/gig.repository";
import { IRepoResponse } from "../../IBaseRepositories";
import { BadRequestError } from "../../Presentation/Error/errorInterface";

export interface ISellerGigUpdateDTO {
  id: string;
  active: boolean;
}

export interface ISellerGigUpdateResult {}

export class updateActiveGigUsecase {
  public async execute(input: ISellerGigUpdateDTO): Promise<ISellerGigUpdateResult> {
    await this.processGigUpdate(input);

    return {};
  }

  private async processGigUpdate(input: ISellerGigUpdateDTO): Promise<void> {
    const { id, active } = input;

    const result: IRepoResponse = await updateGIG(id, { gig: { active } });

    if (!result || result.isNull) {
      throw new BadRequestError('Failed to create gig', 'Seller Gig update error');
    }
  }
}
