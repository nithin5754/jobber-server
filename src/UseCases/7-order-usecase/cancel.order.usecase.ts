

import { convertOrderData, deleteCancelOrder } from '../../Database/Mongoose/Repositories/order.repository';
import { Order } from '../../Entities/Order';
import { IRepoResponse } from '../../IBaseRepositories';

import { BadRequestError } from '../../Presentation/Error/errorInterface';

export interface IOrderCancelOrderDTO {
  orderId: string;
}

export interface IOrderCancelOrderResult {
  data: Order;
}

export class CancelOrderUsecase {
  constructor() {}

  public async execute(input: IOrderCancelOrderDTO): Promise<IOrderCancelOrderResult> {
    const result: IRepoResponse = await deleteCancelOrder(input.orderId);
    if (!result || !result.order) {
      throw new BadRequestError('error: Something went wrong', 'CancelOrderUsecase() Not Found ');
    }

    return {
      data: convertOrderData(result.order)
    };
  }
}
