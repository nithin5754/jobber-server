import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from '../../Error/errorInterface';

import { orderUpdateSchema } from '../../schemas/5-order-schemas/order.schemas';
import {
  IOrderRequestExtensionResult,
  UpdateRequestExtensionUsecase
} from '../../../UseCases/7-order-usecase/requestExtension.order.usecase';
import { ApproveOrderUsecase, IOrderApproveOrderResult } from '../../../UseCases/7-order-usecase/approveOrderusecase';
import { UniqueId } from '../../../External-libraries/1-unique-id/unique-id.service';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { CloudinaryUploads } from '../../../External-libraries/3-cloudinary/cloudinary-uploads.service';
import { IDeliveredWork } from '../../../Interface/IOrder.interface';
import { ISellerDeliverOrderResult, SellerDeliverOrderUsecase } from '../../../UseCases/7-order-usecase/seller.orderDelivered.usecase';
import { MulterFileConverter } from '../../../External-libraries/5-multer-converter/multer-convertor.service';

export class UpdateOrderController {
  constructor(private readonly requestExtensionUsecase: UpdateRequestExtensionUsecase,
    private readonly approveOrder:ApproveOrderUsecase,
    private readonly orderDelivered:SellerDeliverOrderUsecase,
     private readonly uniqueIdService: UniqueId,
     private readonly cloudinaryService:CloudinaryUploads,
     private readonly multerService:MulterFileConverter
  ) {}

  public async requestExtension(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { error } = await Promise.resolve(orderUpdateSchema.validate(req.body));

      if (error?.details) {
        throw new BadRequestError(error.details[0].message, 'Update requestExtension() method');
      }

      const { orderId } = req.params;

      const result: IOrderRequestExtensionResult = await this.requestExtensionUsecase.execute({ orderId: orderId, data: req.body });

      res.status(StatusCodes.OK).json({ message: 'Order delivery request', order: result.data });
    } catch (error) {
      next(error);
    }
  }

  public async buyerApproveOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    console.log("deliver-buyer-approve")
    try {
      const { orderId } = req.params;

      if(!orderId){
        throw new BadRequestError('params Not Found', 'Update buyerApproveOrder() method');
      }

      const isUpdate:IOrderApproveOrderResult=await this.approveOrder.execute({orderId})

      if(!isUpdate||!isUpdate.data){
        throw new BadRequestError('Error: update ', 'Update buyerApproveOrder() method');
      }


      res.status(StatusCodes.OK).json({ message: 'Order approved successfully.', order:isUpdate.data });

      
    } catch (error) {
      next(error)
    }
  }

  /**
   * async deliverOrder
   */
  public async deliverOrder(req: Request, res: Response, next: NextFunction): Promise<void> {

    try {
      const { orderId } = req.params;
      let file: Express.Multer.File | undefined  = req.file;

     let fileContent:string=''
      
      if(file){
        const dataURI: string = this.multerService.convertFileToString(file) as string;
        fileContent=(await this.uploadFiles(req.body.fileType,dataURI)).url as string 

      }
    
   const deliveredWork:IDeliveredWork ={
     message:req.body.message,
     file:fileContent,
     fileType:req.body.fileType,
     fileSize:req.body.fileSize,
     fileName:req.body.fileName
   }

   const result:ISellerDeliverOrderResult=await this.orderDelivered.execute({orderId,deliveredWork})

   if (!result||!result.data) {
    throw new BadRequestError('File upload error. Try again', 'Update deliverOrder() method');
  }
   res.status(StatusCodes.OK).json({ message: 'Order delivered successfully.', order:result.data });
      
    } catch (error) {
      next(error)
    }
  }


  private async uploadFiles(fileType:string,file:string):Promise<{url:string}>{
    let result: UploadApiResponse;
    const randomCharacters:string=await this.generateRandomCharacters()

   result=(fileType === 'zip' ? await this.uploadsPhotos(file, `${randomCharacters}.zip`) : await this.uploadsPhotos(file)) as UploadApiResponse;

   if (!result.public_id) {
    throw new BadRequestError('File upload error. Try again', 'Update deliverOrder() method');
  }

  return {
    url:result?.secure_url
  }

  }


  private async generateRandomCharacters(): Promise<string> {
    const randomBytes: Buffer = await this.uniqueIdService.createRandomBytes();

    return randomBytes.toString('hex') as string;
  }


    private async uploadsPhotos(
      file: string,
      public_id?: string,
      overWrite?: boolean,
      invalidate?: boolean
    ): Promise<UploadApiResponse | UploadApiErrorResponse | undefined> {
      return this.cloudinaryService.uploads(file, public_id, overWrite, invalidate);
    }
    
  
}
