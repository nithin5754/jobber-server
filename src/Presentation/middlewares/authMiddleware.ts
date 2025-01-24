import { NextFunction, Request, Response } from 'express';

import { JwtPayload } from 'jsonwebtoken';
import { NotAuthorizedError } from '../Error/errorInterface';
import { JwtToken } from '../../Infrastructure/External-libraries/6-token.ts/token.service';
import { IAuthPayload } from '../../Infrastructure/External-libraries/6-token.ts/itoken.interface';

declare global {
  namespace Express {
    interface Request {
      currentUser: {
        userId: string;
        email: string;
        username: string;
      };
    }
  }
}

const tokenClass = new JwtToken();

class AuthMiddleware {
  public verifyJWT = (req: Request, _res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new NotAuthorizedError('Invalid request', 'jWT AUTH() method: Request not coming from api gateway');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new NotAuthorizedError('Invalid request', 'VerIfyJWT() method: Request not coming from api ');
    }

    try {
      let decodedToken: string | JwtPayload = tokenClass.verifyAccessToken(token);
      
      

      if (typeof decodedToken !== 'string' && decodedToken.userId && decodedToken.email && decodedToken.username) {
   

        let payload: IAuthPayload = {
          userId: decodedToken.userId,
          email: decodedToken.email,
          username: decodedToken.username
        };

        if (!payload) {
          throw new NotAuthorizedError('Token is not available. Please login again.', 'jWT AUTH() method invalid session error');
        }

        req.currentUser = payload;
      } else {
        throw new NotAuthorizedError('Token is not available. Please login again.', 'jWT AUTH() method invalid session error');
      }

      next();
    } catch (error) {
      throw new NotAuthorizedError('Invalid request', 'jWT AUTH() method: Request payload is invalid');
    }
  };
}

export const authMiddleware: AuthMiddleware = new AuthMiddleware();
