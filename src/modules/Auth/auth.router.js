import validation from "../../middleware/validation.js";
import * as validators from "./auth.validation.js";
import * as authController from "./controller/regiteration.js";
import { Router } from "express";
const router = Router();
router.post("/signup", validation(validators.signup), authController.signup);
router.get(
  "/confirmEmail/:token",
  validation(validators.token),
  authController.confirmEmail
);
router.get(
  "/refreshEmail/:token",
  validation(validators.token),
  authController.refreshEmail
);
router.post("/signin", validation(validators.signin), authController.signin);
router.patch(
  "/sendCode",
  validation(validators.sendCode),
  authController.sendCode
);
router.patch(
  "/forgetPassword",
  validation(validators.forgetPassword),
  authController.forgetPassword
);
export default router;
