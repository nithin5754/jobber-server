import { Request, Response, NextFunction } from 'express';
import { IController } from '../../../Shared/IController';
import { StatusCodes } from 'http-status-codes';
import { GetByIdSellerGig, ISellerGigGetByIdResult } from '../../../Application/use-cases/4-gig-usecase/get-id.gig.usecase';
import { BadRequestError } from '../../error/error.interface';
import { GetSellerGigs, ISellerGigGetBySellerIdResult } from '../../../Application/use-cases/4-gig-usecase/get-sellerId.gig.usecase';
import { GetSellerPausedGigs, ISellerGigGetByPausedGigsResult } from '../../../Application/use-cases/4-gig-usecase/get-paused.gig.usecses';
import {
  MoreLikeThisResult,
  MoreLikeThisUsecase
} from '../../../Application/use-cases/4-gig-usecase/get-MoreGigsLikeThis';

import { GetByCategorySellerGig, ISellerGigGetByCategoryResult } from '../../../Application/use-cases/4-gig-usecase/get-category.gig.usecase';
import { CacheLoginUser, selectedCategory } from '../../../Infrastructure/databse/cache/Cache';


export class GetGig implements IController {
  constructor(
    private readonly getById: GetByIdSellerGig,
    private readonly getSellerGigs: GetSellerGigs,
    private readonly getPausedGigs: GetSellerPausedGigs,
    private readonly getMoreLikeThis: MoreLikeThisUsecase,
    private readonly getByCategorySellerGig:GetByCategorySellerGig,
    private readonly gatewayCache:CacheLoginUser,
  ) {}
  handle(_req: Request, _res: Response, _next: NextFunction): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public async gigById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const gigId = req.params.gigId;
      if (!gigId) {
        throw new BadRequestError('Not Found, Something Went Wrong', 'GetGig Controller() Missing');
      }

      const gig: ISellerGigGetByIdResult = await this.getById.execute({
        gigId
      });

      if (!gig || !gig.gig) {
        throw new BadRequestError('Not Found, Something Went Wrong', 'GetGig Controller() Missing');
      }
      res.status(StatusCodes.OK).json({ message: 'Get gig by id', gig: gig.gig });
    } catch (error) {
      next(error);
    }
  }

  public async sellerGigs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sellerId = req.params.sellerId;
      if (!sellerId) {
        throw new BadRequestError('Not Found, Something Went Wrong', 'sellerGigs Controller() Missing');
      }

      const found: ISellerGigGetBySellerIdResult = await this.getSellerGigs.execute({
        sellerId
      });

      if (!found || !found.gigArray) {
        throw new BadRequestError('Not Found, Something Went Wrong', 'sellerGigs Controller() Missing');
      }

      res.status(StatusCodes.OK).json({ message: 'Get gig by id', gigArray: found.gigArray });
    } catch (error) {
      next(error);
    }
  }

  public async sellerInactiveGigs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sellerId = req.params.sellerId;
      if (!sellerId) {
        throw new BadRequestError('Not Found, Something Went Wrong', 'sellerGigs Controller() Missing');
      }
      const found: ISellerGigGetByPausedGigsResult = await this.getPausedGigs.execute({
        sellerId
      });
   
      res.status(StatusCodes.OK).json({ message: 'Seller Inactive gigs', gigArray:found&&found.gigArray?found.gigArray:[] });
    } catch (error) {
      next(error);
    }
  }

  public async topRatedGigsByCategory (req: Request, res: Response): Promise<void> {
    const category=req.params.category

    if (!category) {
      throw new BadRequestError('Not Found, Something Went Wrong', 'topRatedGigsByCategory() Missing');
    }

    const result:ISellerGigGetByCategoryResult=await this.getByCategorySellerGig.execute({category})

    res.status(StatusCodes.OK).json({message: 'Search top gigs results', gigArray: result.gigs });
  };

  public async moreLikeThis(req: Request, res: Response, next: NextFunction): Promise<void> {   
    try {
      const gigId = req.params.gigId;
      if (!gigId) {
        throw new BadRequestError('Not Found, Something Went Wrong', 'moreLikeThis() Missing');
      }

      const gigs: MoreLikeThisResult = await this.getMoreLikeThis.execute({ gigId });

      res.status(StatusCodes.OK).json({ message: 'More gigs like this result', gigArray: gigs.gigArray });
    } catch (error) {
      next(error);
    }
  }

  public async gigsByCategory(req: Request, res: Response): Promise<void> {
   
     
    let category=this.gatewayCache.getUserSelectedGigCategory(`selectedCategories:${req.params.username}`,selectedCategory);


    if (!category) {
      res.status(StatusCodes.OK).json({ message: 'Search gigs category results', gigArray: [] });
    }else{


      const result:ISellerGigGetByCategoryResult=await this.getByCategorySellerGig.execute({category})
      res.status(StatusCodes.OK).json({ message: 'Search gigs category results', gigArray: result.gigs });
    }

  
  }
}
