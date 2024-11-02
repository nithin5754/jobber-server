import { Application, Router } from "express";
import authRouter from "./auth.routes";


export const routes = (app: Application, router: Router) => {
  app.use("/api/v1/auth", authRouter(router));


};

export default routes;