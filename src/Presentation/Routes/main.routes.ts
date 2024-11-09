import { Application, Router } from "express";
import authRouter from "./auth.routes";
import CurrentRouter from "./current-user.routes";


export const routes = (app: Application, router: Router) => {
  app.use("/api/v1/auth", authRouter(router));
  app.use('/api/v1/current',CurrentRouter(router))


};

export default routes;