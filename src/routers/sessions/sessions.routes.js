const { Router } = require("express");
const SessionsController = require("../../controllers/sessions.controller");
const {
  passportCustom,
} = require("../../middlewares/passportCustom.middleware");
const uploader = require("../../utils/multer.utils");

const router = Router();

router.post(
  "/register",
  uploader.single("profile_image"),
  SessionsController.register
);

router.post("/login", SessionsController.login);

router.get("/github", passportCustom("github", { scope: ["user:email"] }));

router.get(
  "/github/callback",
  passportCustom("github"),
  SessionsController.loginGithub
);

router.get(
  "/current",
  passportCustom("jwt"),
  SessionsController.currentSession
);

router.get("/logout", SessionsController.logOut);

module.exports = router;
