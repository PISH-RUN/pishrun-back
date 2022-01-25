"use strict";

const { yup, validateYupSchema } = require("@strapi/utils");

const createUserBodySchema = yup.object().shape({
  mobile: yup
    .string()
    .matches(/^(\+98|0)?9\d{9}$/)
    .required(),
});

const updateUserBodySchema = yup
  .object()
  .noUnknown(true)
  .shape({
    email: yup.string().email().nullable(),
    gender: yup
      .string()
      .matches(/(male|female)/)
      .nullable(),
    firstName: yup.string().nullable(),
    lastName: yup.string().nullable(),
    birthdate: yup.string().nullable(),
    degree: yup.string().nullable(),
    linkedin: yup.string().url().nullable(),
    twitter: yup.string().url().nullable(),
    behance: yup.string().url().nullable(),
    avatar: yup.string().url().nullable(),
  });

module.exports = {
  validateCreateUserBody: validateYupSchema(createUserBodySchema),
  validateUpdateUserBody: validateYupSchema(updateUserBodySchema),
};
