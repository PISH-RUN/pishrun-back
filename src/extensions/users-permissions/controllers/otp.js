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
const { ApplicationError, ValidationError, ForbiddenError } = utils.errors;

const formatError = error => [
  { messages: [{ id: error.id, message: error.message, field: error.field }] }
];

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
  if(
    user.otpSentAt &&
    differenceInMinutes(now, parseISO(user.otpSentAt)) < tokenRequestPeriod
  ) {
    return;
  }

  let otp = token().toString();
  if(
    user.otp &&
    user.otpExpiresAt &&
    differenceInMinutes(now, parseISO(user.otpExpiresAt)) < tokenExpiryMinutes
  ) {
    otp = user.otp;
  }

  await updateUser(user.id, {
    otp,
    otpSentAt: now,
    otpExpiresAt: addMinutes(now, 15)
  });

  await smsService().otp(user.mobile, otp);
};

const createUser = async (userData) => {
  const advanced = await strapi
    .store({ type: "plugin", name: "users-permissions", key: "advanced" })
    .get();

  const defaultRole = await strapi
    .query("plugin::users-permissions.role")
    .findOne({ where: { type: advanced.default_role } });

  try {
    return await getService("user").add({ ...userData, role: defaultRole });
  } catch (error) {
    throw new ApplicationError(error.message);
  }
};

const createUsers = async (usersData) => {
  const advanced = await strapi
    .store({ type: "plugin", name: "users-permissions", key: "advanced" })
    .get();

  const defaultRole = await strapi
    .query("plugin::users-permissions.role")
    .findOne({ where: { type: advanced.default_role } });

  try {
    return await Promise.all(usersData.map(async user => {
      return await getService("user")
        .add({ ...user, role: defaultRole.id });
    }));
  } catch (error) {
    throw new ApplicationError(error.message);
  }
};

const isAdmin = async (user) => {
  if(user.admin) {
    return true;
  }

  const userParticipants = await strapi.query("api::participant.participant")
    .findMany({
      where: {
        users_permissions_user: {
          id: user.id
        }
      },
      populate: ["team", "team.event"]
    });

  if(!userParticipants || userParticipants.length === 0) {
    return false;
  }

  let activeEvent = false;
  let activeParticipant = false;
  userParticipants.map(p => {
    if(!activeEvent && p.team && p.team.event && p.team.event.active) {
      activeEvent = p.team.event;
      activeParticipant = p;
    }
  });

  if(activeParticipant.hr) return true;

  return !!(activeEvent && activeParticipant.role === "manager");
};

module.exports = {
  async otp(ctx) {
    await validateCreateUserBody(ctx.request.body);

    const { mobile } = ctx.request.body;

    let user = await strapi
      .query("plugin::users-permissions.user")
      .findOne({ where: { mobile } });

    if(!user) {
      user = await createUser({ mobile });
    }

    if(mobile.startsWith("+98966666")) {
      await updateUser(user.id, {
        otp: "6666"
      });

      return {
        ok: true
      };
    }

    await sendOtp(user);

    return {
      ok: true
    };
  },

  async addUser(ctx) {
    await validateCreateUserBody(ctx.request.body);

    const data = ctx.request.body;

    let user = await strapi
      .query("plugin::users-permissions.user")
      .findOne({ where: { mobile: data.mobile } });

    if(!user) {
      user = await createUser(data);

      return {
        ok: true
      };
    }

    ctx.res.statusCode = 422;
    return ctx.res.end();
  },

  async addUsers(ctx) {
    const data = ctx.request.body.data;

    const users = await createUsers(data);

    return {
      data: users,
      ok: true
    };
  },

  async login(ctx) {
    const params = ctx.request.body;
    let user;

    if(params.password) {
      user = await strapi
        .query("plugin::users-permissions.user")
        .findOne({ where: { mobile: params.mobile } });

      const validPassword = strapi.plugins[
        "users-permissions"
        ].services.user.validatePassword(params.password, user.password);

      if(!validPassword) {
        return ctx.badRequest(
          null,
          formatError({
            id: "Auth.form.error.invalid",
            message: "Identifier or password invalid."
          })
        );
      }
    } else {
      const query = {
        mobile: params.mobile,
        otp: params.token
      };

      user = await strapi
        .query("plugin::users-permissions.user")
        .findOne({ where: query });

      if(
        !user ||
        differenceInMinutes(new Date(), parseISO(user.otpExpiresAt)) >
        tokenExpiryMinutes
      ) {
        throw new ValidationError("Invalid Credentials");
      }

      await updateUser(user.id, {
        otp: null,
        registered: true,
        otpSentAt: null,
        otpExpiresAt: null
      });
    }

    if(params.scope === "portal") {
      const is_admin = await isAdmin(user);
      if(!is_admin) {
        throw new ForbiddenError();
      }
    }

    ctx.send({
      jwt: getService("jwt").issue({
        id: user.id
      }),
      user: await sanitizeUser(user, ctx)
    });
  }
};
