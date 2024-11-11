import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../../error/error.interface";
import { IUser } from "../../../Entities/User";
import { IAuthService } from "../../../Interfaces/IAuthService";
import { StatusCodes } from "http-status-codes";
import { omit } from "lodash";

export class VerifyEmail {
  private userData: IUser | null = null;
  constructor(private authservice: IAuthService) {}

  update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { token } = req.body;


      console.log(token,"helo token")

      if (!token) {
        throw new BadRequestError(
          "verification token error please try after sometime.",
          "VerifyEmail update() method error"
        );
      }

      const checkIfUserExist: IUser | undefined =
        await this.authservice.getAuthUserByVerificationToken(token);

      if (!checkIfUserExist) {
        throw new BadRequestError(
          "Verification token is either invalid or is already used.",
          "VerifyEmail update() method error"
        );
      }

      await this.authservice.getUpdateVerifyEmailField(
        checkIfUserExist.id as string,
        true
      );

      let updatedUser: IUser | undefined =
        await this.authservice.getFetchDataById(checkIfUserExist.id!);

      if (!updatedUser) {
        throw new BadRequestError(
          "something went wrong .try again",
          "VerifyEmail update() method error"
        );
      }

      this.userData = omit(updatedUser, ["password"]);

      return res
        .status(StatusCodes.OK)
        .json({ message: "Email verified successfully.", user: this.userData });
    } catch (error) {
  
      next(error);
    }
  };
}
