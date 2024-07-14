import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const signup = joi
  .object({
    userName: joi.string().required().min(2).max(20).message({
      "any.required": "userName is required",
      "any.empty": "empty userName isn't acceptable",
    }),
    email: generalFields.email.messages({
      "any.required": "Email is required",
      "string.empty": "not allowed to be empty",
      "string.base": "only string is allowed",
      "string.email": "please enter realy email",
    }),
    password: generalFields.password,
    cPassword: generalFields.cPassword.valid(joi.ref("password")),
    role: joi.string().valid("Client", "Admin")
  })
  .required();
export const signin = joi
  .object({
    email: generalFields.email.messages({
      "any.required": "Email is required",
      "string.empty": "not allowed to be empty",
      "string.base": "only string is allowed",
      "string.email": "please enter realy email",
    }),
    password: generalFields.password,
  })
  .required();
export const token = joi
  .object({
    token: joi.string().required(),
  })
  .required();
export const sendCode = joi
  .object({
    email: generalFields.email.messages({
      "any.required": "Email is required",
      "string.empty": "not allowed to be empty",
      "string.base": "only string is allowed",
      "string.email": "please enter realy email",
    }),
  })
  .required();
export const forgetPassword = joi
  .object({
    email: generalFields.email.messages({
      "any.required": "Email is required",
      "string.empty": "not allowed to be empty",
      "string.base": "only string is allowed",
      "string.email": "please enter realy email",
    }),
    code: joi.number().required(),
    password: generalFields.password,
    cPassword: generalFields.cPassword.valid(joi.ref("password")),
  })
  .required();
