


import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { BadRequestError } from '../../Error/errorInterface';
import { CancelOrderUsecase, IOrderCancelOrderResult } from '../../../UseCases/7-order-usecase/cancel.order.usecase';

export class CancelOrderController {
  constructor(private readonly cancelOrder: CancelOrderUsecase) {}

  public async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
if(!req.params.orderId ){
  throw new BadRequestError('Error: credentials missing', 'CancelOrderController() method');
}

      const data: IOrderCancelOrderResult = await this.cancelOrder.execute({ orderId: req.params.orderId });

      if (!data || !data.data) {
        throw new BadRequestError('Error : something went wrong', 'CancelOrderController() method');
      }
      res.status(StatusCodes.OK).json({ message: 'Order cancelled successfully.'});

    } catch (error) {
      next(error);
    }
  }
}
