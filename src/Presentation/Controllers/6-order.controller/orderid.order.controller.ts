import { NextFunction, Request, Response } from 'express';
import { GetOrderIdUsecase, IOrderGetOrderIdResult } from '../../../UseCases/7-order-usecase/get.order.usecase';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from '../../Error/errorInterface';

export class OrderByOrderId {
  constructor(private readonly orderIdUsecase: GetOrderIdUsecase) {}

  public async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    console.log("helo hello")
    try {
      console.log('order-orderId', req.params.orderId);
      const data: IOrderGetOrderIdResult = await this.orderIdUsecase.execute({ orderId: req.params.orderId });

      if (!data || !data.data) {
        throw new BadRequestError('Error : Get Orders by OrderId ', 'OrderByOrderId() method');
      }

      res.status(StatusCodes.OK).json({ message: 'Order by order id using', order: data.data });
    } catch (error) {
      next(error);
    }
  }
}
