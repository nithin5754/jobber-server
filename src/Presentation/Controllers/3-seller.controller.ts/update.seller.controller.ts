import Joi from 'joi';
import { ISellerUpdateResult, UpdateSellerUsecase } from '../../../UseCases/3-seller-usecase/update.seller.usercase';

import { BadRequestError } from '../../Error/errorInterface';
import { Request, Response, NextFunction } from 'express';
import { ISeller } from '../../../Interface/ISeller.interface';
import { StatusCodes } from 'http-status-codes';

export class UpdateSeller  {
  constructor(private updatesellerusecase: UpdateSellerUsecase, private validation: Joi.ObjectSchema<any>) {}
  public async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
         try {
          await this.validateRequest(req);

          const sellerId: string = req.params.sellerId;
      
          const seller: ISeller = {
            fullName: req.body.fullName,
            description: req.body.description,
            oneliner: req.body.oneliner,
            skills: req.body.skills,
            languages: req.body.languages,
            responseTime: req.body.responseTime,
            experience: req.body.experience,
            education: req.body.education,
            socialLinks: req.body.socialLinks,
            certificates: req.body.certificates
          };
      
          const found: ISellerUpdateResult = await this.updatesellerusecase.execute({ filter: sellerId, sellerParams: seller });
      
          res.status(StatusCodes.OK).json({ message: 'Seller created successfully.', seller: found.seller });
         } catch (error) {
          next(error)
         }
  }

  private async validateRequest(req: Request): Promise<void> {
    const { error } = (await Promise.resolve(this.validation)).validate(req.body);
    if (error?.details) {
      throw new BadRequestError(error.details[0].message, 'UpdateSeller() validation error');
    }
  }
}
