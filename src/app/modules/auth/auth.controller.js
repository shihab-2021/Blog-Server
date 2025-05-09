import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { authServices } from "./auth.service.js";

const registerUser = catchAsync(async (req, res) => {
  const result = await authServices.registerUser(req.body);
  sendResponse(res, {
    status: true,
    statusCode: StatusCodes.CREATED,
    message: "User is registered successfully!",
    data: result,
  });
});

const oauthRegister = catchAsync(async (req, res) => {
  const result = await authServices.oauthRegister(req.body);

  res.cookie("refreshToken", result.refreshToken, {
    secure: true,
    // secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  sendResponse(res, {
    status: true,
    statusCode: StatusCodes.CREATED,
    message: "User is registered successfully!",
    data: {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      role: result.role,
    },
  });
});

const loginUser = catchAsync(async (req, res) => {
  const result = await authServices.loginUser(req.body);

  res.cookie("refreshToken", result.refreshToken, {
    secure: true,
    // secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  sendResponse(res, {
    status: true,
    statusCode: StatusCodes.OK,
    message: "Login successful!",
    data: {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      role: result.role,
    },
  });
});

const oauthLogin = catchAsync(async (req, res) => {
  console.log(req.body);
  const result = await authServices.oauthLogin(req.body);

  res.cookie("refreshToken", result.refreshToken, {
    secure: true,
    // secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  sendResponse(res, {
    status: true,
    statusCode: StatusCodes.OK,
    message: "Login successful!",
    data: {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      role: result.role,
    },
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await authServices.refreshToken(refreshToken);
  sendResponse(res, {
    status: true,
    statusCode: StatusCodes.OK,
    message: "Access token is retrieved successfully!",
    data: result,
  });
});

const getUserProfileData = catchAsync(async (req, res) => {
  const user = await authServices.getUserProfileData(req.user);
  sendResponse(res, {
    status: true,
    statusCode: StatusCodes.OK,
    message: "Profile data fetched successfully!",
    data: user,
  });
});

const getAllUser = catchAsync(async (req, res) => {
  const result = await authServices.getAllUser();
  sendResponse(res, {
    status: true,
    statusCode: StatusCodes.OK,
    message: "Users fetched successfully!",
    data: result,
  });
});

const getSingleUser = catchAsync(async (req, res) => {
  const result = await authServices.getSingleUser(req.params.id);

  sendResponse(res, {
    status: true,
    statusCode: StatusCodes.OK,
    message: "User Fetched successfully!",
    data: result,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const result = await authServices.updateUser(req.params.id, req.body);

  sendResponse(res, {
    status: true,
    statusCode: StatusCodes.OK,
    message: "User Updated successfully!",
    data: result,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  await authServices.deleteUser(req.params.id);
  sendResponse(res, {
    status: true,
    statusCode: StatusCodes.OK,
    message: "User deleted successfully!",
    data: null,
  });
});

const toggleUserRole = catchAsync(async (req, res) => {
  console.log(req.body.email);
  await authServices.toggleUserRole(req.body.email);
  sendResponse(res, {
    status: true,
    statusCode: StatusCodes.OK,
    message: "User role updated!",
    data: null,
  });
});

export const authControllers = {
  registerUser,
  oauthRegister,
  loginUser,
  oauthLogin,
  refreshToken,
  getUserProfileData,
  getAllUser,
  getSingleUser,
  updateUser,
  deleteUser,
  toggleUserRole,
};
