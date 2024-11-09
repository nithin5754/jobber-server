import { NextFunction, Request, Response } from "express";
import { loginSchema } from "../../schemas/1-auth-schemas/signin.schema";
import { BadRequestError } from "../../error/error.interface";
import { firstLetterUpperCase, isEmail } from "../../utils/helper.utils";
import { IUser } from "../../../Entities/User";
import { IAuthService } from "../../../Interfaces/IAuthService";
import { compare } from "bcryptjs";
import { StatusCodes } from "http-status-codes";

import { omit } from "lodash";
import { Console } from "console";

export class SignIn {
  constructor(private authService: IAuthService) {}
  private userData: IUser | null = null;
  private message: string = "User login Successfully";


  read = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    console.log("LOGIN DATA FORM",req.body)
    const { error } = (await Promise.resolve(loginSchema)).validate(req.body);
    if (error?.details) {
      throw new BadRequestError(
        error.details[0].message,
        "SignIn read() method error"
      );
    }
    try {
      const { username, password } = req.body;
      const isValidEmail: boolean = isEmail(username);
      let type: "username" | "email" = "username";
      isValidEmail ? (type = "email") : (type = "username");
      const existingUser: IUser | undefined =
        await this.authService.fetchUserDetails(firstLetterUpperCase(username), type);
      if (!existingUser || !existingUser.password) {
        throw new BadRequestError(
          "Invalid credentials",
          "SignIn read() method error"
        );
      }
      const isPasswordIsMatch: boolean = await compare(
        password,
        existingUser.password
      );
      if (!isPasswordIsMatch) {
        throw new BadRequestError(
          "Invalid credentials-password not match",
          "SignIn read() method error"
        );
      }
      const { accessToken, refreshToken } = this.authService.signToken(
        existingUser.id as string,
        existingUser.email as string,
        existingUser.username as string
      );
      if (!accessToken || !refreshToken) {
        throw new BadRequestError(
          "Invalid credentials .try again later",
          "SignIn read() method error"
        );
      }
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "none",
      });
      this.userData = omit(existingUser, ["password"]);
      res.status(StatusCodes.CREATED).json({
        message: this.message,
        user: this.userData,
        token: accessToken,
      });
    } catch (error) {
      next(error);
    }
  };
}
