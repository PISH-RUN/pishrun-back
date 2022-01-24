"use strict";

const differenceInMinutes = require("date-fns/differenceInMinutes");
const addMinutes = require("date-fns/addMinutes");
const parseISO = require("date-fns/parseISO");
const { validateCreateUserBody } = require("./validations/user");
const utils = require("@strapi/utils");
const { getService, smsService } = require("../utils");
const tokenExpiryMinutes = 15;
const tokenRequestPeriod = 0;

const { sanitize } = utils;
const { ApplicationError, ValidationError } = utils.errors;

const sanitizeUser = (user, ctx) => {
  const { auth } = ctx.state;
  const userSchema = strapi.getModel("plugin::users-permissions.user");

  return sanitize.contentAPI.output(user, userSchema, { auth });
};

const random = (min, max) => Math.floor(Math.random() * (max - min) + min);

const token = () => random(1000, 9999);

const updateUser = async (id, data) => await getService("user").edit(id, data);

const sendOtp = async (user) => {
  const now = new Date();
  if (
    user.otpSentAt &&
    differenceInMinutes(now, parseISO(user.otpSentAt)) < tokenRequestPeriod
  ) {
    return;
  }

  let otp = token().toString();
  if (
    user.otp &&
    user.otpExpiresAt &&
    differenceInMinutes(now, parseISO(user.otpExpiresAt)) < tokenExpiryMinutes
  ) {
    otp = user.otp;
  }

  await updateUser(user.id, {
    otp,
    otpSentAt: now,
    otpExpiresAt: addMinutes(now, 15),
  });

  await smsService().otp(user.mobile, otp);
};

const createUser = async (mobile) => {
  const defaultRole = await strapi
    .query("plugin::users-permissions.role")
    .findOne({ where: { type: advanced.default_role } });

  try {
    return await getService("user").add({ mobile, role: defaultRole });
  } catch (error) {
    throw new ApplicationError(error.message);
  }
};

module.exports = {
  async otp(ctx) {
    const advanced = await strapi
      .store({ type: "plugin", name: "users-permissions", key: "advanced" })
      .get();

    await validateCreateUserBody(ctx.request.body);

    const { mobile } = ctx.request.body;

    let user = await strapi
      .query("plugin::users-permissions.user")
      .findOne({ where: { mobile } });

    if (!user) {
      user = await createUser(mobile);
    }

    await sendOtp(user);

    return {
      ok: true,
    };
  },

  async login(ctx) {
    const params = ctx.request.body;

    const query = {
      mobile: params.mobile,
      otp: params.token,
    };

    const user = await strapi
      .query("plugin::users-permissions.user")
      .findOne({ where: query });

    if (
      !user ||
      differenceInMinutes(new Date(), parseISO(user.otpExpiresAt)) >
        tokenExpiryMinutes
    ) {
      throw new ValidationError("Invalid Credentials");
    }

    await updateUser(user.id, {
      otp: null,
      otpSentAt: null,
      otpExpiresAt: null,
    });

    ctx.send({
      jwt: getService("jwt").issue({
        id: user.id,
      }),
      user: await sanitizeUser(user, ctx),
    });
  },
};
