import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { BadRequestError } from '../../Error/errorInterface';
import {  RejectDeliveryUsecase } from '../../../UseCases/7-order-usecase/reject.delivery.usecase';
import { ApproveDeliveryUsecase } from '../../../UseCases/7-order-usecase/approve.delivery.usecase';
import { IExtendedDelivery } from '../../../Interface/IOrder.interface';

import moment from 'moment'; 
import { Order } from '../../../Entities/Order';


export interface IDeliveryResult {
  data: Order;
}

export class DeliveryDateController {
  constructor(
    private readonly rejectDeliveryUsecase: RejectDeliveryUsecase,
    private readonly approveDeliveryUsecase: ApproveDeliveryUsecase
  ) {}

  public async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orderId = req.params.orderId;
      const type = req.params.type;
      console.log('orderId-DeliveryDateController ', orderId, 'type', type);

      if (!orderId || !type) {
        throw new BadRequestError('Error : credentials is missing ', 'RejectDeliveryController() method');
      }

       
      const EXtensionDeliveryDate: IExtendedDelivery = {
        originalDate:req.body.originalDate,
        newDate: req.body.newDate,
        days: parseInt(`${req.body.days}`),
        reason: req.body.reason,
        deliveryDateUpdate:req.body.deliveryDateUpdate
        
      };

      console.log("EXtensionDeliveryDate",EXtensionDeliveryDate)

      if (!EXtensionDeliveryDate && type === 'approve') {
        throw new BadRequestError('Error :Credentials data missing ', 'DeliveryDateController() method Missing');
      }

      const data: IDeliveryResult =
        type === 'approve'
          ? await this.approveDeliveryUsecase.execute({ orderId, data: EXtensionDeliveryDate })
          : await this.rejectDeliveryUsecase.execute({ orderId });

      if (!data || !data.data) {
        throw new BadRequestError('Error : Get Orders by SellerId ', 'OrderBySellerId() method');
      }

      res.status(StatusCodes.OK).json({ message: 'Order delivery date extension', order: data.data });
    } catch (error) {
      next(error);
    }
  }
}
