import { approveOrder, convertOrderData } from '../../Database/Mongoose/Repositories/order.repository';
import { Order } from '../../Entities/Order';
import { IRepoResponse } from '../../IBaseRepositories';

import { BadRequestError } from '../../Presentation/Error/errorInterface';

export interface IOrderApproveOrderDTO {
  orderId: string;
}

export interface IOrderApproveOrderResult {
  data: Order;
}

export class ApproveOrderUsecase {
  constructor() {}

  public async execute(input: IOrderApproveOrderDTO): Promise<IOrderApproveOrderResult> {
    const result: IRepoResponse = await approveOrder(input.orderId);
    if (!result || !result.order) {
      throw new BadRequestError('error', 'Create order() Not Found ');
    }

    return {
      data: convertOrderData(result.order)
    };
  }
}
