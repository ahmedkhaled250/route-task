import { auth } from "../../middleware/auth.js";
import validation from "../../middleware/validation.js";
import { fileValidation, myMulter } from "../../utils/multer.js";
import endPoint from "./category.endPoint.js";
import * as validators from "./category.validation.js";
import * as categoryController from "./controller/category.js";
import tskRouter from "../Task/task.router.js"
import { Router } from "express";
const router = Router();
router.use("/:categoryId/task", tskRouter)
router.post(
  "/",
  myMulter(fileValidation.image).single("image"),
  validation(validators.createCategory),
  auth(endPoint.Admin),
  categoryController.createCategory
);
router.put(
  "/:id",
  myMulter(fileValidation.image).single("image"),
  validation(validators.updateCategory),
  auth(endPoint.Admin),
  categoryController.updateCategory
);
router.get(
  "/",
  validation(validators.categories),
  categoryController.categories
);
router.get(
  "/:id",
  validation(validators.getCategoryById),
  categoryController.getCategoryById
);
export default router;
