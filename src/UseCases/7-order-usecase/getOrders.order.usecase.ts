import {  convertOrderDataArray, getOrder } from '../../Database/Mongoose/Repositories/order.repository';
import { Order } from '../../Entities/Order';
import { IRepoResponse } from '../../IBaseRepositories';
import { BadRequestError } from '../../Presentation/Error/errorInterface';

export interface IOrderGetOrdersDTO {
  sellerId?: string;
  buyerId?: string;
}

export interface IOrderGetOrdersResult {
  data: Order[];
}

export class GetOrdersUsecase {
  constructor() {}

  public async execute(input: IOrderGetOrdersDTO): Promise<IOrderGetOrdersResult> {
    const result: IRepoResponse = await getOrder({ order: { ...input } });
    if (!result || !result.orders || !result.orders.length) {
      throw new BadRequestError('Error :', 'GetOrdersUsecase() Not Found ');
    }

    return {
      data: convertOrderDataArray(result.orders)
    };
  }
}
