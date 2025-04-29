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

export const blogServices = { createBlog, updateBlog, deleteBlog, getAllBlogs };
