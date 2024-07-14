import joi from "joi";
import {
  generalFields,
  validateQuery,
} from "../../middleware/validation.js";
export const addTask = joi
  .object({
    name: joi.string().min(2).max(50).required(),
    shared: joi.boolean(),
    Content_type: joi.string().valid("List", "Text"),
    textBody: joi.string(),
    deadline: joi.date().required(),
    listBody: joi.array().items(joi.string()),
    categoryId: generalFields.id,
    authorization: generalFields.headers,
  })
  .required()
export const updateTask = joi
  .object({
    name: joi.string().min(2).max(50),
    shared: joi.boolean(),
    deadline: joi.date(),
    textBody: joi.string(),
    listBody: joi.array().items(joi.string()),
    id: generalFields.id,
    categoryId: generalFields.id,
    authorization: generalFields.headers,
  })
  .required()
export const deleteTask = joi
  .object({
    id: generalFields.id,
    authorization: generalFields.headers,
  })
  .required()
  export const tasks = joi
  .object({
    shared:joi.boolean(),
    ...validateQuery,
  })
  .required()
export const myTasks = joi
  .object({
    shared:joi.boolean(),
    ...validateQuery,
    authorization: generalFields.headers,
  })
  .required()
  export const getTaskById = joi
  .object({
    id: generalFields.id,
  })
  .required()
  export const getMyTaskById = joi
  .object({
    id: generalFields.id,
    authorization: generalFields.headers,
  })
  .required()
export const getTasksOfSpecificCategory = joi
  .object({
    categoryId: generalFields.id,
  })
  .required()
  