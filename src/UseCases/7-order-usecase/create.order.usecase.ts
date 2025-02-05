import { convertOrderData, createOrder } from '../../Database/Mongoose/Repositories/order.repository';
import { Order } from '../../Entities/Order';
import { IRepoResponse } from '../../IBaseRepositories';
import { IOrder } from '../../Interface/IOrder.interface';
import { BadRequestError } from '../../Presentation/Error/errorInterface';

export interface IOrderCreateDTO {
  order: IOrder;
}

export interface IOrderCreateResult {
  data: Order;
}

export class CreateOrderUsecase {
  constructor() {}

  public async execute(input: IOrderCreateDTO): Promise<IOrderCreateResult> {
    const result: IRepoResponse = await createOrder({ order: input.order });

    if (!result || !result.order) {
      throw new BadRequestError('error', 'Create order() Not Found ');
    }

    return {
      data:convertOrderData(result.order)
    };
  }
}
