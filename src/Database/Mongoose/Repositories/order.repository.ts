import { Order } from '../../../Entities/Order';
import { IRepoRequest, IRepoResponse } from '../../../IBaseRepositories';
import { IOrder, IOrderDocument } from '../../../Interface/IOrder.interface';
import { OrderModel } from '../Models/order.schema';

export async function createOrder(params: IRepoRequest): Promise<IRepoResponse> {
  const data: IOrderDocument = (await OrderModel.create({ ...params.order })) as IOrderDocument;

  return {
    order: data
  };
}

/**
 *
 * @param params {using get order id,get order seller id,get order buyer id}
 * @returns
 */
export async function getOrder(params: IRepoRequest): Promise<IRepoResponse> {
  const data: IOrderDocument[] = (await OrderModel.aggregate([
    {
      $match: { ...params.order }
    }
  ])) as IOrderDocument[];

  return {
    orders: data
  };
}

export function convertOrderData(data: IOrderDocument): Order {
  return new Order(data);
}

export function convertOrderDataArray(data: IOrderDocument[]): Order[] {
  let orders: Order[] = [];

  for (let i = 0; i < data.length; i++) {
    let output = new Order(data[i]);
    orders.push(output);
  }

  return orders;
}
