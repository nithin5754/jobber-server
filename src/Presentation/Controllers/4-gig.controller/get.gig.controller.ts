import { Request, Response, NextFunction } from 'express';
import { IController } from '../../../shared/icontroller';
import { StatusCodes } from 'http-status-codes';
import { GetByIdSellerGig, ISellerGigGetByIdResult } from '../../../Application/use-cases/4-gig-usecase/get-id.gig.usecase';
import { BadRequestError } from '../../error/error.interface';
import { GetSellerGigs, ISellerGigGetBySellerIdResult } from '../../../Application/use-cases/4-gig-usecase/get-sellerId.gig.usecase';
import { GetSellerPausedGigs, ISellerGigGetByPausedGigsResult } from '../../../Application/use-cases/4-gig-usecase/get-paused.gig.usecses';

export class GetGig implements IController {
  constructor(
    private readonly getById: GetByIdSellerGig,
    private readonly getSellerGigs: GetSellerGigs,
    private readonly getPausedGigs: GetSellerPausedGigs
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

      const gig: ISellerGigGetBySellerIdResult = await this.getSellerGigs.execute({
        sellerId
      });

      if (!gig || !gig.gigArray) {
        throw new BadRequestError('Not Found, Something Went Wrong', 'sellerGigs Controller() Missing');
      }


      res.status(StatusCodes.OK).json({ message: 'Get gig by id', gigArray: gig.gigArray });
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
      const gig: ISellerGigGetByPausedGigsResult = await this.getPausedGigs.execute({
        sellerId
      });
      if (!gig || !gig.gigArray) {
        throw new BadRequestError('Empty Gigs, Something Went Wrong', 'sellerInactiveGigs Controller() Missing');
      }
      res.status(StatusCodes.OK).json({ message: 'Seller gigs', gig: gig.gigArray });
    } catch (error) {
      next(error);
    }
  }

  // public async topRatedGigsByCategory (req: Request, res: Response): Promise<void> {
  //   const category = await getUserSelectedGigCategory(`selectedCategories:${req.params.username}`);
  //   const resultHits: ISellerGig[] = [];
  //   const gigs: ISearchResult = await getTopRatedGigsByCategory(`${category}`);
  //   for(const item of gigs.hits) {
  //     resultHits.push(item._source as ISellerGig);
  //   }
  //   res.status(StatusCodes.OK).json({ message: 'Search top gigs results', total: gigs.total, gigs: resultHits });
  // };
}
