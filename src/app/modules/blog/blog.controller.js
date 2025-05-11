import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { blogServices } from "./blog.service.js";

const createBlog = catchAsync(async (req, res) => {
  const result = await blogServices.createBlog(req.user, req.body);
  sendResponse(res, {
    status: true,
    statusCode: StatusCodes.CREATED,
    message: "Blog created successfully!",
    data: result,
  });
});

const getASpecificBlog = catchAsync(async (req, res) => {
  const result = await blogServices.getASpecificBlog(req.params.id);
  sendResponse(res, {
    status: true,
    statusCode: StatusCodes.OK,
    message: "Blog updated successfully!",
    data: result,
  });
});

const updateBlog = catchAsync(async (req, res) => {
  const result = await blogServices.updateBlog(
    req.user,
    req.params.id,
    req.body
  );
  sendResponse(res, {
    status: true,
    statusCode: StatusCodes.OK,
    message: "Blog updated successfully!",
    data: result,
  });
});

const deleteBlog = catchAsync(async (req, res) => {
  await blogServices.deleteBlog(req.user, req.params.id);
  sendResponse(res, {
    status: true,
    statusCode: StatusCodes.OK,
    message: "Blog deleted successfully!",
    data: null,
  });
});

const getAllBlogs = catchAsync(async (req, res) => {
  const result = await blogServices.getAllBlogs(req.query);
  sendResponse(res, {
    status: true,
    statusCode: StatusCodes.OK,
    message: "Blogs fetched successfully!",
    data: result,
  });
});

const addComment = catchAsync(async (req, res) => {
  await blogServices.addComment(req.user, req.params.id, req.body);
  sendResponse(res, {
    status: true,
    statusCode: StatusCodes.OK,
    message: "Comment added successfully!",
    data: null,
  });
});

const getComments = catchAsync(async (req, res) => {
  const result = await blogServices.getComments(req.params.id);
  sendResponse(res, {
    status: true,
    statusCode: StatusCodes.OK,
    message: "Comment fetched successfully!",
    data: result,
  });
});

const addLike = catchAsync(async (req, res) => {
  await blogServices.addLike(req.user, req.params.id);
  sendResponse(res, {
    status: true,
    statusCode: StatusCodes.OK,
    message: "Like added successfully!",
    data: null,
  });
});

const addDislike = catchAsync(async (req, res) => {
  await blogServices.addDislike(req.user, req.params.id);
  sendResponse(res, {
    status: true,
    statusCode: StatusCodes.OK,
    message: "Like added successfully!",
    data: null,
  });
});

const getBlogsByUser = catchAsync(async (req, res) => {
  const result = await blogServices.getBlogsByUser(req.params.id);
  sendResponse(res, {
    status: true,
    statusCode: StatusCodes.OK,
    message: "Blog fetched successfully!",
    data: result,
  });
});

const suspendBlog = catchAsync(async (req, res) => {
  await blogServices.suspendBlog(req.user, req.params.id);
  sendResponse(res, {
    status: true,
    statusCode: StatusCodes.OK,
    message: "Blog suspend updated!",
    data: null,
  });
});

const getAdminDashboardStats = catchAsync(async (req, res) => {
  const result = await blogServices.getAdminDashboardStats();
  sendResponse(res, {
    status: true,
    statusCode: StatusCodes.OK,
    message: "Blog fetched successfully!",
    data: result,
  });
});

const suspendCommentOnBlog = catchAsync(async (req, res) => {
  await blogServices.suspendCommentOnBlog(
    req.params.blogId,
    req.params.commentId
  );
  sendResponse(res, {
    status: true,
    statusCode: StatusCodes.OK,
    message: "Comment suspend updated!",
    data: null,
  });
});

const getAllBlogsForAdmin = catchAsync(async (req, res) => {
  const result = await blogServices.getAllBlogsForAdmin(req.query);
  sendResponse(res, {
    status: true,
    statusCode: StatusCodes.OK,
    message: "Blogs fetched successfully!",
    data: result,
  });
});

export const blogControllers = {
  createBlog,
  getASpecificBlog,
  updateBlog,
  deleteBlog,
  getAllBlogs,
  addComment,
  getComments,
  addLike,
  addDislike,
  getBlogsByUser,
  suspendBlog,
  getAdminDashboardStats,
  suspendCommentOnBlog,
  getAllBlogsForAdmin,
};
