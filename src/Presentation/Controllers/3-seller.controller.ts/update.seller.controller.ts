import Joi from 'joi';
import { ISellerUpdateResult, UpdateSellerUsecase } from '../../../Application/use-cases/3-seller-usecase/update.seller.usercase';
import { IController } from '../../../shared/IController';
import { BadRequestError } from '../../error/error.interface';
import { Request, Response, NextFunction } from 'express';
import { ISeller } from '../../../Domain/interface/ISeller.interface';
import { StatusCodes } from 'http-status-codes';

export class UpdateSeller implements IController {
  constructor(private updatesellerusecase: UpdateSellerUsecase, private validation: Joi.ObjectSchema<any>) {}
  public async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
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
  }

  private async validateRequest(req: Request): Promise<void> {
    const { error } = (await Promise.resolve(this.validation)).validate(req.body);
    if (error?.details) {
      throw new BadRequestError(error.details[0].message, 'UpdateSeller() validation error');
    }
  }
}
