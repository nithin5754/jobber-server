import { Router } from "express";
import { SignUp } from "../Controllers/1-auth-controller/signup";
import { AuthService } from "../../Use Cases/1-auth-service/auth.service";
import { AuthRepository } from "../../frameworks/databse/mongoose/Repositories/AuthRepository";
import { Crypto } from "../../External-libraries/1-crypto/Crypto";
import { Uuid } from "../../External-libraries/2-public-id/Uuid";
import { CloudinaryUploads } from "../../External-libraries/3-cloudinary/Cloudinary-uploads";
import { Mailer } from "../../External-libraries/4-mailer/mailer";

const authRepository=new AuthRepository()
const authService=new AuthService(authRepository)

const  crypto=new Crypto()
const uuid=new Uuid()
const uploads=new CloudinaryUploads()
const mailer=new Mailer()

const signup_controller=new SignUp(authService,crypto,uuid,uploads,mailer)

const authRouter = (router: Router) => {

  router
  .route("/register")
  .post(signup_controller.onCreateUser.bind(signup_controller));


  return router

};




export default authRouter