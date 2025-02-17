import { Request, Response, NextFunction } from 'express';
import { GetSellerUsecase, ISellerGetDTO, ISellerGetResult } from '../../../UseCases/3-seller-usecase/get.seller.usecase';

import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from '../../Error/errorInterface';

export class GetSellerByUsername {
  constructor(private readonly getsellerUsecase: GetSellerUsecase) {}
  public async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sellerUsername: string = req.params.username;

      if (!sellerUsername) {
        throw new BadRequestError('credentials not found', 'GetSellerById() missing error');
      }

      const data: ISellerGetDTO = {
        username: sellerUsername
      };

      const found: ISellerGetResult = await this.getsellerUsecase.execute(data);

      if (!found || !found.seller) {
        throw new BadRequestError('Missing Content', 'GetSellerByUsername() Validation Error ');
      }
      res.status(StatusCodes.OK).json({ message: 'Seller profile', seller: found.seller });
    } catch (error) {
      next(error);
    }
  }
}
