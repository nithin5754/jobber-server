



import {  convertOrderData, updateRejectDeliveryDate } from '../../Database/Mongoose/Repositories/order.repository';

import { IRepoResponse } from '../../IBaseRepositories';
import { IDeliveryResult } from '../../Presentation/Controllers/6-order.controller/delivery-date.controller';


import { BadRequestError } from '../../Presentation/Error/errorInterface';

export interface IRejectDeliveryOrderDTO {
  orderId: string;

}

export class RejectDeliveryUsecase {
  constructor() {}

  public async execute(input: IRejectDeliveryOrderDTO): Promise<IDeliveryResult> {


    const result: IRepoResponse = await updateRejectDeliveryDate(input.orderId);
    if (!result || !result.order) {
      throw new BadRequestError('error', 'Create order() Not Found ');
    }

    return {
      data: convertOrderData(result.order)
    };
  }
}
