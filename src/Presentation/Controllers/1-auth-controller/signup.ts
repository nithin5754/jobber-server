import { NextFunction, Request, Response } from "express";
import { IAuthService } from "../../../Interfaces/IAuthService";
import { IUser } from "../../../Entities/User";
import { signupSchema } from "../../schemas/1-auth-schemas/signup.schemas";
import { BadRequestError } from "../../error/error.interface";
import { ICrypto } from "../../../External-libraries/1-crypto/ICrypto";
import { IUuid } from "../../../External-libraries/2-public-id/IUuid";
import { UploadApiResponse } from "cloudinary";
import { ICloudinary } from "../../../External-libraries/3-cloudinary/ICloudinary";
import { firstLetterUpperCase, lowerCase } from "../../utils/helper.utils";
import { IMailer } from "../../../External-libraries/4-mailer/IMailer";
import config from "../../../config";
export class SignUp {
  constructor(
    private authService: IAuthService,
    private crypto: ICrypto,
    private uuid: IUuid,
    private uploads: ICloudinary,
    private mailer: IMailer
  ) {}

  onCreateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { error } = (await Promise.resolve(signupSchema)).validate(
        req.body
      );

      if (error?.details) {
        console.log("error");
        throw new BadRequestError(
          error.details[0].message,
          "SignUp create() method error"
        );
      }

      const {
        username,
        email,
        password,
        country,
        browserName,
        profilePicture,
        deviceType,
      } = req.body;

      const checkUserExist = await this.authService.usernameOrEmail(
        email,
        username
      );

      if (checkUserExist) {
        throw new BadRequestError(
          "Invalid credentials. Email or Username",
          "SignUp create() method error"
        );
      }

      const profilePublicId: string = this.uuid.createUuid();

      const uploadResult: UploadApiResponse = (await this.uploads.uploads(
        profilePicture,
        `${profilePublicId}`,
        true,
        true
      )) as UploadApiResponse;

      if (!uploadResult.public_id) {
        throw new BadRequestError(
          "File upload error. Try again",
          "SignUp create() method error"
        );
      }

      let randomBytes: Buffer = await this.crypto.createRandomBytes();

      const randomCharacters: string = randomBytes.toString("hex");

      const authData: IUser = {
        username: firstLetterUpperCase(username),
        email: lowerCase(email),
        profilePublicId,
        password,
        country,
        profilePicture: profilePicture,
        emailVerificationToken: randomCharacters,
        browserName,
        deviceType,
      } as IUser;

      let result = await this.authService.create(authData);
      const verificationLink = `${config.URL_.CLIENT_URL}/confirm_email?v_token=${authData.emailVerificationToken}`;
      await this.mailer.SendEmail({
        email: result?.email,
        link: verificationLink,
        html: `<h1>Hy ${result?.username}</h1><br><p>Your LINK for the verification is <div><h2>${verificationLink}</h2></div></p>`,
      });

      return res.status(200).json({ message: 'User created successfully',user:result,token:'1234556'});
    } catch (error: any) {
      next(error);
    }
  };
}
