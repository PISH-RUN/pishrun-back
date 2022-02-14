"use strict";

const { yup, validateYupSchema } = require("@strapi/utils");

const createUserBodySchema = yup.object().shape({
  mobile: yup
    .string()
    .matches(/^\+989\d{9}$/)
    .required(),
  referredBy: yup
    .number(),
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
    maritalStatus: yup
      .string()
      .matches(/(single|married)/)
      .nullable(),
    firstName: yup.string().nullable(),
    lastName: yup.string().nullable(),
    birthdate: yup.string().nullable(),
    degree: yup.string().nullable(),
    fieldStudy: yup.string().nullable(),
    abilities: yup.string().nullable(),
    equipment: yup.string().nullable(),
    fcmToken: yup.string().nullable(),
    children: yup.number().integer().nullable(),
    linkedin: yup.string().url().nullable(),
    twitter: yup.string().url().nullable(),
    instagram: yup.string().url().nullable(),
  });

module.exports = {
  validateCreateUserBody: validateYupSchema(createUserBodySchema),
  validateUpdateUserBody: validateYupSchema(updateUserBodySchema),
};
