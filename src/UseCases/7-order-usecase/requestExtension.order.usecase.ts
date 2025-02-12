import { convertOrderData, updateRequestDeliveryExtension } from '../../Database/Mongoose/Repositories/order.repository';
import { Order } from '../../Entities/Order';
import { IRepoResponse } from '../../IBaseRepositories';
import { IExtendedDelivery } from '../../Interface/IOrder.interface';
import { BadRequestError } from '../../Presentation/Error/errorInterface';

export interface IOrderRequestExtensionDTO {
  orderId: string;

  data: IExtendedDelivery;
}

export interface IOrderRequestExtensionResult {
  data: Order;
}

export class UpdateRequestExtensionUsecase {
  constructor() {}

  public async execute(input: IOrderRequestExtensionDTO): Promise<IOrderRequestExtensionResult> {
    const result: IRepoResponse = await updateRequestDeliveryExtension(input.orderId, input.data);
    if (!result || !result.order) {
      throw new BadRequestError('error', 'UpdateRequestEExtension() Not Found ');
    }

    return {
      data: convertOrderData(result.order)
    };
  }
}
