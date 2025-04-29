import { model, Schema } from "mongoose";

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide blog title"],
    },
    category: {
      type: String,
      required: [true, "Please provide blog category"],
    },
    content: {
      type: String,
      required: [true, "Please provide blog content"],
    },
    thumbnail: {
      type: String,
      required: [true, "Please provide blog thumbnail"],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tags: [
      {
        type: String,
      },
    ],
    isPublic: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// checking if the blog exist by _id
blogSchema.statics.isBlogExistsById = async function (id) {
  return await Blog.findById(id);
};

export const Blog = model("Blog", blogSchema);
