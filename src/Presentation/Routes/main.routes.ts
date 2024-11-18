import { Application, Router } from 'express';
import authRouter from './auth.routes';
import { authMiddleware } from '../middlewares/authMiddleware';
import CurrentRouter from './current-user.routes';
import BuyerRouter from './buyer.routes';


export const routes = (app: Application, router: Router) => {
  app.use('/api/v1/auth', authRouter(router));
  app.use('/api/v1/current', authMiddleware.verifyJWT, CurrentRouter(router));

  app.use('/api/v1/buyer', authMiddleware.verifyJWT, BuyerRouter(router));

};

export default routes;
