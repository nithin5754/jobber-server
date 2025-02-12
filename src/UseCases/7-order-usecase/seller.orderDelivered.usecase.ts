import { convertOrderData, sellerDeliverOrder } from '../../Database/Mongoose/Repositories/order.repository';
import { Order } from '../../Entities/Order';
import { IRepoResponse } from '../../IBaseRepositories';
import { IDeliveredWork } from '../../Interface/IOrder.interface';

import { BadRequestError } from '../../Presentation/Error/errorInterface';

export interface ISellerDeliverOrderDTO {
  orderId: string;
deliveredWork:IDeliveredWork 

}

export interface ISellerDeliverOrderResult {
  data: Order;
}

export class SellerDeliverOrderUsecase {
  constructor() {}

  public async execute(input: ISellerDeliverOrderDTO): Promise<ISellerDeliverOrderResult> {


    const result: IRepoResponse = await sellerDeliverOrder(input.orderId,true,input.deliveredWork);
    if (!result || !result.order) {
      throw new BadRequestError('error', 'Create order() Not Found ');
    }

    return {
      data: convertOrderData(result.order)
    };
  }
}
