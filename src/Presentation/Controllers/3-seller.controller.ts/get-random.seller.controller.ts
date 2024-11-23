import { Request, Response, NextFunction } from 'express';
import { IController } from '../../../shared/icontroller';
import {
  ISellerRandomDTO,
  ISellerRandomResult,
  RandomSellersUsecase
} from '../../../Application/use-cases/3-seller-usecase/random.usecase';
import { BadRequestError } from '../../error/error.interface';
import { StatusCodes } from 'http-status-codes';

export class RandomSeller implements IController {
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
      res.status(StatusCodes.OK).json({ message: 'Seller profile', seller: found.sellerArray });
    } catch (error) {
      next(error);
    }
  }
}