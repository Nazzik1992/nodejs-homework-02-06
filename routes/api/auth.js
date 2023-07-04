const express = require("express");
const authController = require("../../controllers/authController");
const { schemas } = require("../../shemas/userSchema");
const { validateBody } = require("../../decoretors");
const {authenticate, upload} = require("../../middlewares");

const router = express.Router();


router.post("/register", validateBody(schemas.registerSchema), authController.register);

router.get('/verify/:verificationToken', authController.verify);

router.post('/verify', validateBody(schemas.emailSchema), authController.resendVerify);

router.post("/login", validateBody(schemas.loginSchema), authController.login)

router.get("/current", authenticate, authController.getCurrent);

router.post("/logout", authenticate, authController.logout);

router.patch("/avatars", authenticate, upload.single("avatar"), authController.avatar)


module.exports = router;