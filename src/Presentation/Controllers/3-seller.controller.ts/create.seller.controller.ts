import { Request, Response, NextFunction } from 'express';

import { ISeller } from '../../../Interface/ISeller.interface';
import { CreateSellerUseCase, ISellerCreateResult } from '../../../UseCases/3-seller-usecase/create.seller.usecase';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from '../../Error/errorInterface';
import Joi from 'joi';

export class CreateSeller {
  constructor(private readonly sellerCreateUseCase: CreateSellerUseCase, private readonly validation: Joi.ObjectSchema<any>) {}
  public async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.validateRequest(req);

      const seller: ISeller = {
        fullName: req.body.fullName,
        userId: req.currentUser.userId,
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

      const createdSeller: ISellerCreateResult | null = await this.sellerCreateUseCase.execute({
        sellerParams: seller
      });

      if (!createdSeller || !createdSeller.seller) {
        throw new BadRequestError('Error Occurred Creating Seller Profile', 'Create Seller() validation error');
      }

      res.status(StatusCodes.CREATED).json({ message: 'Seller created successfully.', seller: createdSeller.seller });
    } catch (error) {
      next(error);
    }
  }

  private async validateRequest(req: Request): Promise<void> {
    const { error } = (await Promise.resolve(this.validation)).validate(req.body);
    if (error?.details) {
      throw new BadRequestError(error.details[0].message, 'Create Seller() validation error');
    }
  }
}
