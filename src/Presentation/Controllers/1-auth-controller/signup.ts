import { NextFunction, Request, Response } from "express";
import { IAuthService } from "../../../Interfaces/IAuthService";
import { IUser } from "../../../Entities/User";
import { signupSchema } from "../../schemas/1-auth-schemas/signup.schemas";
import { BadRequestError } from "../../error/error.interface";
import { UploadApiResponse } from "cloudinary";
import { firstLetterUpperCase, lowerCase } from "../../utils/helper.utils";
import config from "../../../config";
import { EmailTemplate } from "../../../External-libraries/4-mailer/mail.templete";
import { StatusCodes } from "http-status-codes";
import { omit } from "lodash";

export class SignUp {

  private userData :IUser|null=null
  constructor(private authService: IAuthService) {}

  onCreateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      let profilePicture: Express.Multer.File | undefined = req.file;

      if (!profilePicture) {
        throw new BadRequestError(
          "file is missing",
          "SignUp create() method error"
        );
      }

      const { error } = (await Promise.resolve(signupSchema)).validate(
        req.body
      );

      if (error?.details) {
        throw new BadRequestError(
          error.details[0].message,
          "SignUp create() method error"
        );
      }

      const { username, email, password, country, browserName, deviceType } =
        req.body;
      const checkUserExist = await this.authService.usernameOrEmail(
        email,
        firstLetterUpperCase(username)
      );
      if (checkUserExist.email) {
        throw new BadRequestError(
          "Error. Email already exist",
          "SignUp create() method error"
        );
      } else if (checkUserExist.username) {
        throw new BadRequestError(
          "Error . Username already exist",
          "SignUp create() method error"
        );
      } else if (checkUserExist.email && checkUserExist.username) {
        throw new BadRequestError(
          "Error . Username and Email already exit,",
          "SignUp create() method error"
        );
      }

      let dataURI: string = this.authService.convertFileToString(
        profilePicture
      ) as string;
      const profilePublicId: string = this.authService.createUuid();
      const uploadResult: UploadApiResponse =
        (await this.authService.uploadsPhotos(
          dataURI,
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

      let randomBytes: Buffer = await this.authService.createRandomBytes();

      const randomCharacters: string = randomBytes.toString("hex");

      const authData: IUser = {
        username: firstLetterUpperCase(username),
        email: lowerCase(email),
        profilePublicId,
        password,
        country,
        profilePicture: uploadResult?.secure_url,
        emailVerificationToken: randomCharacters,
        browserName,
        deviceType,
      } as IUser;

      let result = await this.authService.create(authData);

      if (!result) {
        throw new BadRequestError(
          "new user creating  error. Try again",
          "SignUp create() method error"
        );
      }
      const verificationLink = `${config.URL_.CLIENT_URL}/confirm_email?v_token=${authData.emailVerificationToken}`;

      if (result && result.username) {
        await this.authService.SendEmail({
          receiverEmail: result?.email,
          verifyLink: verificationLink,
          subject: "verify your mail",
          html: EmailTemplate.verify_email_2({
            username: result.username,
            verificationLink,
          }),
        });
      }

      const { accessToken, refreshToken } = this.authService.signToken(
        result.id as string,
        result.email as string,
        result.username as string
      );

      if (!accessToken || !refreshToken) {
        throw new BadRequestError(
          "server error creating new user. Try again",
          "SignUp create() method error"
        );
      }
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "none",
      });


      this.userData = omit(result, ["password"]);

      res.status(StatusCodes.CREATED).json({
        message: "User created successfully",
        user: this.userData,
        token: accessToken,
      });
    } catch (error: any) {
      next(error);
    }
  };
}
