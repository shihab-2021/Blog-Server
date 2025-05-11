import { Router } from "express";
import { blogControllers } from "./blog.controller.js";
import auth from "../../middlewares/auth.js";
import { USER_ROLE } from "../user/user.constant.js";

const router = Router();

router
  .route("/")
  .get(blogControllers.getAllBlogs)
  .post(auth(USER_ROLE.user, USER_ROLE.admin), blogControllers.createBlog);

router
  .route("/admin/blogs")
  .get(auth(USER_ROLE.admin), blogControllers.getAllBlogsForAdmin);

router
  .route("/dashboard-stats")
  .get(auth(USER_ROLE.admin), blogControllers.getAdminDashboardStats);

router
  .route("/comment/:id")
  .get(auth(USER_ROLE.user, USER_ROLE.admin), blogControllers.getComments)
  .post(auth(USER_ROLE.user, USER_ROLE.admin), blogControllers.addComment);

router
  .route("/like/:id")
  // .get(auth(USER_ROLE.user, USER_ROLE.admin), blogControllers.getComments)
  .post(auth(USER_ROLE.user, USER_ROLE.admin), blogControllers.addLike);

router
  .route("/suspend/:id")
  .put(auth(USER_ROLE.admin), blogControllers.suspendBlog);

router
  .route("/comment-suspend/blog/:blogId/comment/:commentId")
  .put(auth(USER_ROLE.admin), blogControllers.suspendCommentOnBlog);

router
  .route("/dislike/:id")
  // .get(auth(USER_ROLE.user, USER_ROLE.admin), blogControllers.getComments)
  .post(auth(USER_ROLE.user, USER_ROLE.admin), blogControllers.addDislike);

router
  .route("/userBlogs/:id")
  .get(auth(USER_ROLE.user, USER_ROLE.admin), blogControllers.getBlogsByUser);

router
  .route("/:id")
  .get(auth(USER_ROLE.user, USER_ROLE.admin), blogControllers.getASpecificBlog)
  .patch(auth(USER_ROLE.user, USER_ROLE.admin), blogControllers.updateBlog)
  .delete(auth(USER_ROLE.user, USER_ROLE.admin), blogControllers.deleteBlog);

export const blogRoutes = router;
