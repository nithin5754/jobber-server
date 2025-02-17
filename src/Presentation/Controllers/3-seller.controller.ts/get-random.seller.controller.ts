import { Request, Response, NextFunction } from 'express';

import {
  ISellerRandomDTO,
  ISellerRandomResult,
  RandomSellersUsecase
} from '../../../UseCases/3-seller-usecase/random.seller.usecase';
import { BadRequestError } from '../../Error/errorInterface';
import { StatusCodes } from 'http-status-codes';

export class RandomSeller {
  constructor(private randomsellerusecase: RandomSellersUsecase) {}
  public async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const randomSize: number = Number(req.params.size);

      if (!randomSize) {
        throw new BadRequestError('size not found', 'RandomSeller() missing error');
      }

      const data: ISellerRandomDTO = {
        size: randomSize
      };

      const found: ISellerRandomResult = await this.randomsellerusecase.execute(data);

      if (!found || !found.sellerArray || found.sellerArray.length < 1) {
        throw new BadRequestError('Missing Content', 'RandomSeller() Validation Error');
      }
      res.status(StatusCodes.OK).json({ message: 'Seller profile', sellerArray: found.sellerArray });
    } catch (error) {
      next(error);
    }
  }
}
