import { auth } from "../../middleware/auth.js";
import validation from "../../middleware/validation.js";
import endPoint from "./task.endPoint.js";
import * as validators from "./task.validation.js";
import * as categoryController from "./controller/task.js";
import { Router } from "express";
const router = Router({ mergeParams: true });
router.post(
  "/",
  validation(validators.addTask),
  auth(endPoint.Client),
  categoryController.addTask
);
router.put(
  "/:id",
  validation(validators.updateTask),
  auth(endPoint.Client),
  categoryController.updateTask
);
router.delete(
  "/:id",
  validation(validators.deleteTask),
  auth(endPoint.Client),
  categoryController.deleteTask
);
router.get(
  "/",
  validation(validators.tasks),
  categoryController.tasks
);
router.get(
  "/myTasks",
  validation(validators.myTasks),
  auth(endPoint.Client),
  categoryController.myTasks
);
router.get(
  "/:id",
  validation(validators.getTaskById),
  categoryController.getTaskById
);
router.get(
  "/:id/myTask",
  validation(validators.getMyTaskById),
  auth(endPoint.Client),
  categoryController.getMyTaskById
);
// I've done this endpoint here to get just tasks which has shared  = true
router.get(
  "/getTasksOfSpecificCategory",
  validation(validators.getTasksOfSpecificCategory),
  categoryController.getTasksOfSpecificCategory
);
export default router;
