import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { GetOrdersUsecase, IOrderGetOrdersResult } from '../../../UseCases/7-order-usecase/getOrders.order.usecase';
import { BadRequestError } from '../../Error/errorInterface';

export class OrderByBuyerId {
  constructor(private readonly orderSellerIdUsecase: GetOrdersUsecase) {}

  public async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: IOrderGetOrdersResult = await this.orderSellerIdUsecase.execute({ sellerId: req.params.buyerId });

      if (!data || !data.data) {
        throw new BadRequestError('Error : Get Orders by BuyerId', 'OrderByBuyerId() method');
      }

      res.status(StatusCodes.OK).json({ message: 'Seller orders', orders: data.data });
    } catch (error) {
      next(error);
    }
  }
}
