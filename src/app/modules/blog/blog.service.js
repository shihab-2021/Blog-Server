import { User } from "../user/user.model.js";
import AppError from "../../errors/AppError.js";
import { StatusCodes } from "http-status-codes";
import { Blog } from "./blog.model.js";
import QueryBuilder from "../../builder/QueryBuilder.js";

const createBlog = async (userData, payload) => {
  // finding the user
  const user = await User.findOne({ email: userData.email });

  // adding blog to db
  const blogData = { ...payload, author: user?._id };
  const createdBlog = await Blog.create(blogData);

  // populate author details
  const result = await Blog.findById(createdBlog._id).populate({
    path: "author",
    select: "name email role",
  });

  return result;
};

const getASpecificBlog = async (blogId) => {
  const result = await Blog.findById(blogId).populate("author");

  if (result === null) {
    throw new Error("Blog does not exists!");
  }

  return result;
};

const updateBlog = async (userData, id, payload) => {
  // finding the user
  const user = await User.findOne({ email: userData.email });

  // checking blog exists
  const blog = await Blog.isBlogExistsById(id);
  if (!blog) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "Not Found Error: Blog does not exists!",
      "NOT_FOUND_ERROR"
    );
  }

  // checking if the author of the blog match
  if (blog?.author.toString() !== user?._id.toString()) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "Authorization Error: Blog author does not matching!",
      "AUTHORIZATION_ERROR"
    );
  }

  // update the blog in db
  await Blog.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  // populate author details
  const result = await Blog.findById(id).populate({
    path: "author",
    select: "name email role",
  });

  return result;
};

const deleteBlog = async (userData, id) => {
  // finding the user
  const user = await User.findOne({ email: userData.email });

  // checking blog exists
  const blog = await Blog.isBlogExistsById(id);
  if (!blog) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "Not Found Error: Blog does not exists!",
      "NOT_FOUND_ERROR"
    );
  }

  // checking if the author of the blog match
  if (blog?.author.toString() !== user?._id.toString()) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "Authorization Error: Blog author is not matching!",
      "AUTHORIZATION_ERROR"
    );
  }

  // update the isDelete in db
  const updateIsDelete = await Blog.findByIdAndUpdate(
    id,
    { isDeleted: true },
    {
      new: true,
      runValidators: true,
    }
  );

  return updateIsDelete;
};

const getAllBlogs = async (query) => {
  const searchableFields = ["title", "content"];
  const blogs = new QueryBuilder(Blog.find(), query)
    .search(searchableFields)
    .sort()
    .filter();

  const result = await blogs.modelQuery.populate({
    path: "author",
    select: "name email role",
  });
  return result;
};

const addComment = async (userData, blogId, comment) => {
  if (!comment) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "Comment is required",
      "NOT_FOUND_ERROR"
    );
  }
  const blog = await Blog.findById(blogId);
  if (!blog) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "Blog not found",
      "NOT_FOUND_ERROR"
    );
  }

  const newComment = {
    userId: userData.id,
    comment: comment?.comment,
    createdAt: new Date(),
  };

  blog.comment.push(newComment);
  await blog.save();

  return blog;
};

const getComments = async (blogId) => {
  const blog = await Blog.findById(blogId)
    .populate("comment.userId", "name email avatar") // Select only specific fields
    .lean();

  if (!blog) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "Blog not found",
      "NOT_FOUND_ERROR"
    );
  }

  const comments = blog.comment.filter((c) => !c.isSuspended);

  return comments;
};

const addLike = async (userData, blogId) => {
  const blog = await Blog.findById(blogId);
  if (!blog) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "Blog not found",
      "NOT_FOUND_ERROR"
    );
  }

  const userId = userData?.id.toString();

  // Remove from dislikes if exists
  blog.dislike = blog.dislike.filter(
    (entry) => entry.userId.toString() !== userId
  );

  // Check if already liked
  const alreadyLiked = blog.like.some(
    (entry) => entry.userId.toString() === userId
  );

  if (alreadyLiked) {
    // Unlike (toggle off)
    blog.like = blog.like.filter((entry) => entry.userId.toString() !== userId);
  } else {
    // Add new like
    blog.like.push({ userId, createdAt: new Date() });
  }

  await blog.save();

  return blog;
};

const addDislike = async (userData, blogId) => {
  const blog = await Blog.findById(blogId);
  if (!blog) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "Blog not found",
      "NOT_FOUND_ERROR"
    );
  }

  const userId = userData?.id.toString();

  // Remove from likes if exists
  blog.like = blog.like.filter((entry) => entry.userId.toString() !== userId);

  // Check if already disliked
  const alreadyDisliked = blog.dislike.some(
    (entry) => entry.userId.toString() === userId
  );

  if (alreadyDisliked) {
    // Remove dislike (toggle off)
    blog.dislike = blog.dislike.filter(
      (entry) => entry.userId.toString() !== userId
    );
  } else {
    // Add new dislike
    blog.dislike.push({ userId, createdAt: new Date() });
  }

  await blog.save();

  return blog;
};

const getBlogsByUser = async (userId) => {
  const blogs = await Blog.find({ author: userId, isDeleted: false })
    .populate({
      path: "author",
      select: "name email role",
    })
    .lean();

  return blogs;
};

export const blogServices = {
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
};
