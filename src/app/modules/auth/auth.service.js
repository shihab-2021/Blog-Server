import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError.js";
import { User } from "../user/user.model.js";
import { createToken, verifyToken } from "./auth.utils.js";
import config from "../../config/index.js";

const registerUser = async (payload) => {
  const user = await User.isUserExistsByEmail(payload.email);
  if (user) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "User with this email already exists!"
    );
  }

  const result = await User.create(payload);
  return result;
};

const oauthRegister = async (payload) => {
  const user = await User.isUserExistsByEmail(payload.email);
  if (user) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "User with this email already exists!"
    );
  }

  // await User.create({
  //   ...payload,
  //   password: payload?.email + "oauth",
  //   role: "user",
  // });
  const result = await User.create({
    ...payload,
    password: payload?.email + "oauth",
  });
  // creating token
  const jwtPayload = {
    email: result.email,
    role: result.role,
  };
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in
  );
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in
  );

  return { accessToken, refreshToken, role: result?.role };
  // return result;
};

const loginUser = async (payload) => {
  // checking if the user is exists
  const user = await User.isUserExistsByEmail(payload.email);
  if (!user) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "Not Found Error: User does not exists!",
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

  // checking if the user is blocked
  const userStatus = user?.isBlocked;
  if (userStatus === true) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "Authorization Error: This user is blocked!",
      "AUTHORIZATION_ERROR"
    );
  }

  // checking if the password is correct
  if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "Authorization Error: Password didn't matched!",
      "AUTHORIZATION_ERROR"
    );
  }

  // creating token
  const jwtPayload = {
    email: user.email,
    role: user.role,
  };
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in
  );
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in
  );

  return { accessToken, refreshToken, role: user?.role };
};

const oauthLogin = async (payload) => {
  // Check if the user already exists
  console.log(payload);
  const user = await User.findOne({ email: payload.email });

  // If the user doesn't exist, create a new one
  if (!user) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "Not Found Error: User does not exists!",
      "NOT_FOUND_ERROR"
    );
    // await User.create({
    //   ...payload,
    //   password: payload?.email + "oauth",
    //   role: "user",
    // });
  }

  // creating token
  const jwtPayload = {
    id: user?._id,
    email: user?.email,
    role: user?.role,
  };
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in
  );
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in
  );

  return { accessToken, refreshToken, role: user?.role };
};

const refreshToken = async (token) => {
  // token validation checking
  const decoded = verifyToken(token, config.jwt_refresh_secret);
  const { email, iat } = decoded;

  // checking user's existence
  const user = await User.isUserExistsByEmail(email);
  if (!user) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "Not Found Error: User does not exists!",
      "NOT_FOUND_ERROR"
    );
  }

  // checking if the user is blocked
  const userStatus = user?.isBlocked;
  if (userStatus === true) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "Authorization Error: This user is blocked!",
      "AUTHORIZATION_ERROR"
    );
  }

  if (
    user.passwordChangedAt &&
    User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat)
  ) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "Authorization Error: You are not authorized!",
      "AUTHORIZATION_ERROR"
    );
  }

  const jwtPayload = {
    email: user.email,
    role: user.role,
  };
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in
  );

  return { accessToken };
};

const getUserProfileData = async (payload) => {
  // checking user's existence
  const user = await User.isUserExistsByEmail(payload.email);
  if (!user) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "Not Found Error: User does not exists!",
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

  // checking if the user is blocked
  const userStatus = user?.isBlocked;
  if (userStatus === true) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "Authorization Error: This user is blocked!",
      "AUTHORIZATION_ERROR"
    );
  }

  user.password = "";

  return user;
};

export const authServices = {
  registerUser,
  oauthRegister,
  loginUser,
  oauthLogin,
  refreshToken,
  getUserProfileData,
};
