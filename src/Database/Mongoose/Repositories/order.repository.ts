import { promises } from 'dns';
import { Order } from '../../../Entities/Order';
import { IRepoRequest, IRepoResponse } from '../../../IBaseRepositories';
import { IDeliveredWork, IExtendedDelivery, IOrderDocument } from '../../../Interface/IOrder.interface';
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

export async function approveOrder(orderId: string): Promise<IRepoResponse> {
  const result: IOrderDocument = (await OrderModel.findOneAndUpdate(
    { orderId },
    {
      $set: {
        approved: true,
        status: 'Completed',
        approvedAt: new Date()
      }
    },
    { new: true }
  ).exec()) as IOrderDocument;

  return {
    order: result
  };
}

export const sellerDeliverOrder = async (orderId: string, delivered: boolean, deliveredWork: IDeliveredWork): Promise<IRepoResponse> => {
  const order: IOrderDocument = (await OrderModel.findOneAndUpdate(
    { orderId },
    {
      $set: {
        delivered,
        status: 'Delivered',
        ['events.orderDelivered']: new Date()
      },
      $push: {
        deliveredWork
      }
    },
    { new: true }
  ).exec()) as IOrderDocument;

  return {
    order
  };
};

export async function updateRequestExtension(orderId: string, data: IExtendedDelivery): Promise<IRepoResponse> {
  const { newDate, days, originalDate, reason } = data;

  const order: IOrderDocument = (await OrderModel.findOneAndUpdate(
    { orderId },
    {
      $set: {
        ['requestExtension.originalDate']: originalDate,
        ['requestExtension.newDate']: newDate,
        ['requestExtension.days']: days,
        ['requestExtension.reason']: reason
      }
    },
    { new: true }
  ).exec()) as IOrderDocument;

  return {
    order
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
