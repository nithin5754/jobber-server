import { Request, Response, NextFunction } from 'express';
import { IController } from '../../../Shared/IController';
import { GetSellerUsecase, ISellerGetDTO, ISellerGetResult } from '../../../Application/UseCases/3-seller-usecase/get.seller.usecase';
import { BadRequestError } from '../../Error/error.interface';
import { StatusCodes } from 'http-status-codes';

export class GetSellerById implements IController {
  constructor(private readonly getsellerUsecase: GetSellerUsecase) {}
  public async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId: string = req.currentUser.userId

      if (!userId) {
        throw new BadRequestError('credentials not found', 'GetSellerById() missing error');
      }

      const data: ISellerGetDTO = {
        userId: userId
      };

      const found: ISellerGetResult = await this.getsellerUsecase.execute(data);

      if (!found || !found.seller) {
        throw new BadRequestError('Missing Content', 'GetSellerById() Validation Error');
      }
      res.status(StatusCodes.OK).json({ message: 'Seller profile', seller: found.seller });
    } catch (error) {
      next(error);
    }
  }
}
