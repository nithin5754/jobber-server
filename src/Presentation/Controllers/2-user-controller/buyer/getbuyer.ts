import { NextFunction, Request, Response } from 'express';
import { IBuyerService } from '../../../../Interfaces/IBuyerService';
import { IBuyer } from '../../../../Entities/Buyer';


import { StatusCodes } from 'http-status-codes';

export class GetBuyer {
  constructor(private buyerService: IBuyerService) {
   
  }



  onEmail = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
     
      const buyer: IBuyer | null = await this.buyerService.getBuyerByEmail(req.currentUser.email);
      res.status(StatusCodes.OK).json({ message: 'Buyer profile', buyer });
    } catch (error) {
      next(error)
    }
  };
}
