import { Router } from "express";
import { authControllers } from "./auth.controller.js";
import auth from "../../middlewares/auth.js";
import { USER_ROLE } from "../user/user.constant.js";

const router = Router();

router.route("/register").post(authControllers.registerUser);

router.route("/login").post(authControllers.loginUser);

router.route("/oauth-login").post(authControllers.oauthLogin);
router.route("/oauth-register").post(authControllers.oauthRegister);

router
  .route("/profile")
  .get(
    auth(USER_ROLE.user, USER_ROLE.admin),
    authControllers.getUserProfileData
  );

router.route("/users").get(
  // auth(USER_ROLE.user, USER_ROLE.admin),
  authControllers.getAllUser
);

router.post("/refresh-token", authControllers.refreshToken);

router
  .route("/users/:id")
  .get(
    // auth(USER_ROLE.admin),
    authControllers.getSingleUser
  )
  .put(auth(USER_ROLE.admin, USER_ROLE.user), authControllers.updateUser)
  .delete(auth(USER_ROLE.admin), authControllers.deleteUser);

export const authRoutes = router;
