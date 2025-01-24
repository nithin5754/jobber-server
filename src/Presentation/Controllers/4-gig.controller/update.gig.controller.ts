import { Request, Response, NextFunction } from 'express';
import { IController } from '../../../Shared/IControllers';

import { StatusCodes } from 'http-status-codes';
import {
  ISellerGigUpdateDTO,
  ISellerGigUpdateResult,
  UpdateGigUsecase
} from '../../../Application/UseCases/4-gig-usecase/updata.gig.usecase';
import { updateActiveGigUsecase } from '../../../Application/UseCases/4-gig-usecase/update.active.gig.usecsase';

export class UpdateGig implements IController {
  constructor(private readonly updateGigInterceptor: UpdateGigUsecase,
    private readonly updateActiveGig:updateActiveGigUsecase
  ) {}

  public async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {

      const gigId:string=req.params.gigId

    const createData: ISellerGigUpdateDTO = {
          data: {
              title: req.body.title,
              description: req.body.description,
              categories: req.body.categories,
              subCategories: req.body.subCategories,
              tags: req.body.tags,
              price: req.body.price,
              expectedDelivery: req.body.expectedDelivery,
              basicTitle: req.body.basicTitle,
              basicDescription: req.body.basicDescription,
              coverImage:req.body.coverImage
          },
          id:gigId
        };
      

  const result:ISellerGigUpdateResult=  await this.updateGigInterceptor.execute(createData);

      res.status(StatusCodes.CREATED).json({
        message: 'Successfully updated GIG',
        gig:result.gig
    
      });
    } catch (error) {
      next(error);
    }
  }

  public async gigUpdateActive (req: Request, res: Response): Promise<void>  {

const active:boolean=req.body.active as boolean
const id:string=req.params.gigId

  await this.updateActiveGig.execute({id,active} );
    res.status(StatusCodes.OK).json({ message: 'Gig updated successfully.' });
  };
  




}
