import { Router } from "express";
import { blogControllers } from "./blog.controller.js";
import auth from "../../middlewares/auth.js";
import { USER_ROLE } from "../user/user.constant.js";

const router = Router();

router.route("/").post(
  // auth(USER_ROLE.user, USER_ROLE.admin),
  blogControllers.createBlog
);

router
  .route("/:id")
  .patch(auth(USER_ROLE.user, USER_ROLE.admin), blogControllers.updateBlog)
  .delete(auth(USER_ROLE.user, USER_ROLE.admin), blogControllers.deleteBlog);

router.route("/").get(blogControllers.getAllBlogs);

export const blogRoutes = router;
