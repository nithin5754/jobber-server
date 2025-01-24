import { Request, Response, NextFunction } from 'express';
import { IController } from '../../../Shared/IController';
import {
  CreateGigUsecase,
  ISellerGigCreateDTO,
  ISellerGigCreateResult
} from '../../../Application/UseCases/4-gig-usecase/create.gig.usecase';

import { BadRequestError } from '../../Error/errorInterface';
import Joi from 'joi';
import { StatusCodes } from 'http-status-codes';

export class CreateGig implements IController {
  constructor(private readonly createGigUsecase: CreateGigUsecase, private readonly validation: Joi.ObjectSchema<any>) {}

  public async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.validateRequest(req);

      const coverImage: Express.Multer.File | undefined = req.file;
      if (!coverImage) {
        throw new BadRequestError('Cover picture is required', 'Create Controller() Missing');
      }

      const createData: ISellerGigCreateDTO = {
        data: {
          ...req.body,
          userId: req.currentUser.userId
        },
        coverImage: coverImage as Express.Multer.File
      };

      const result: ISellerGigCreateResult = await this.createGigUsecase.execute(createData);

      res.status(StatusCodes.CREATED).json({
        message: 'Successfully Created GIG',
        gig: result.sellerGig
      });
    } catch (error) {
      next(error);
    }
  }

  private async validateRequest(req: Request): Promise<void> {
    if (!req.file) {
      throw new BadRequestError('Cover picture is required', 'Create Controller() Missing');
    }

    const { error } = (await Promise.resolve(this.validation)).validate(req.body);
    if (error?.details) {
      throw new BadRequestError(error.details[0].message, 'Create Gig Controller() validation Error ');
    }
  }
}
