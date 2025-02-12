





import {  convertOrderData, updateApproveDeliveryDate } from '../../Database/Mongoose/Repositories/order.repository';

import { IRepoResponse } from '../../IBaseRepositories';
import { IExtendedDelivery } from '../../Interface/IOrder.interface';
import { IDeliveryResult } from '../../Presentation/Controllers/6-order.controller/delivery-date.controller';


import { BadRequestError } from '../../Presentation/Error/errorInterface';

export interface IApproveDeliveryOrderDTO {
  orderId: string;
  data: IExtendedDelivery

}



export class ApproveDeliveryUsecase {
  constructor() {}

  public async execute(input: IApproveDeliveryOrderDTO): Promise<IDeliveryResult> {


    const result: IRepoResponse = await updateApproveDeliveryDate(input.orderId,input.data);
    if (!result || !result.order) {
      throw new BadRequestError('error not found', 'ApproveDelivery Usecase() Not Found ');
    }

    return {
      data: convertOrderData(result.order)
    };
  }
}
