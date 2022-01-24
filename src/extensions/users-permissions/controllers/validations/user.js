"use strict";

const { yup, validateYupSchema } = require("@strapi/utils");

const createUserBodySchema = yup.object().shape({
  mobile: yup
    .string()
    .matches(/^(\+98|0)?9\d{9}$/)
    .required(),
});

const updateUserBodySchema = yup.object().shape({
  email: yup.string().email().min(1),
  username: yup.string().min(1),
  password: yup.string().min(1),
});

module.exports = {
  validateCreateUserBody: validateYupSchema(createUserBodySchema),
};
