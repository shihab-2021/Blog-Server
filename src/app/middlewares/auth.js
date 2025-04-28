import catchAsync from "../utils/catchAsync.js";
import AppError from "../errors/AppError.js";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import config from "../config/index.js";
import { User } from "../modules/user/user.model.js";

const auth = (...requiredRoles) => {
  return catchAsync(async (req, res, next) => {
    const token = req.headers.authorization;

    // checking if the token is messing
    if (!token) {
      throw new AppError(
        StatusCodes.UNAUTHORIZED,
        "Authorization Error: You are not authorized!",
        "AUTHORIZATION_ERROR"
      );
    }

    // checking if the token sent in valid way
    if (!token.startsWith("Bearer ")) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Authentication Error: Authorization token is not sent in valid way!",
        "AUTH_ERROR"
      );
    }

    const splitToken = token.split(" ");
    const accessToken = splitToken[1];

    // checking if the given toke is valid
    const decoded = jwt.verify(accessToken, config.jwt_access_secret);
    const { role, email, iat } = decoded;

    // checking if the user exists
    const user = await User.isUserExistsByEmail(email);
    if (!user) {
      throw new AppError(
        StatusCodes.NOT_FOUND,
        "Not Found Error: This user not found!",
        "NOT_FOUND_ERROR"
      );
    }

    // checking if the user is already deleted
    const isDeleted = user?.isDeleted;
    if (isDeleted) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        "Authorization Error: This user is deleted!",
        "AUTHORIZATION_ERROR"
      );
    }

    // checking if user blocked
    if (user?.isBlocked) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        "Authorization Error: User is blocked!",
        "AUTHORIZATION_ERROR"
      );
    }

    // checking authentication
    if (
      user.passwordChangedAt &&
      User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat)
    ) {
      throw new AppError(
        StatusCodes.UNAUTHORIZED,
        "Authorization Error: You are not authorized!",
        "AUTHORIZATION_ERROR"
      );
    }

    // checking the role is correct
    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(
        StatusCodes.UNAUTHORIZED,
        "Authorization Error: You have no access to this!",
        "AUTHORIZATION_ERROR"
      );
    }

    req.user = { ...decoded, id: user._id };
    next();
  });
};

export default auth;
