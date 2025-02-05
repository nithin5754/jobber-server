


import { convertOrderData, getOrder } from '../../Database/Mongoose/Repositories/order.repository';
import { Order } from '../../Entities/Order';
import { IRepoResponse } from '../../IBaseRepositories';
import { BadRequestError } from '../../Presentation/Error/errorInterface';

export interface IOrderGetOrderIdDTO {

  sellerId?:string;
  buyerId?:string;
  orderId?:string;

  
}

export interface IOrderGetOrderIdResult {
  data: Order;
}

export class GetOrderIdUsecase {
  constructor() {}

  public async execute(input: IOrderGetOrderIdDTO): Promise<IOrderGetOrderIdResult> {

    const result:IRepoResponse=await getOrder({order:{...input}})
    if (!result || !result.orders||!result.orders.length) {
      throw new BadRequestError('error', 'Create order() Not Found ');
    }

    return {
      data:convertOrderData(result.orders[0])
    };
  }
}
