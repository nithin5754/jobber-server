import { NextFunction, Request, Response } from 'express';
import { IOrder } from '../../../Interface/IOrder.interface';
import { CreateOrderUsecase, IOrderCreateResult } from '../../../UseCases/7-order-usecase/create.order.usecase';
import { BadRequestError } from '../../Error/errorInterface';
import { StatusCodes } from 'http-status-codes';

export class CreateOrderController {
  constructor(private readonly createOrder: CreateOrderUsecase) {}

  public async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const serviceFee: number = Number((req.body.price < 50 ? (5.5 / 100) * req.body.price + 2 : (5.5 / 100) * req.body.price).toFixed(2) as string) as number

      const orderData: IOrder = {
        ...req.body,
        serviceFee
      };

      const data: IOrderCreateResult = await this.createOrder.execute({ order: orderData });

      if (!data || !data.data) {
        throw new BadRequestError('Error : Create order ', 'Create order() method');
      }

      res.status(StatusCodes.CREATED).json({ message: 'Order created successfully.', order: data.data });
    } catch (error) {
      next(error);
    }
  }
}
