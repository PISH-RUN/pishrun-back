"use strict";

const { getService } = require("../utils");
const { validateUpdateUserBody } = require("./validations/user");
const utils = require("@strapi/utils");
const merge = require("lodash/merge");
const { sanitize } = utils;

const sanitizeOutput = (user, ctx) => {
  const schema = strapi.getModel("plugin::users-permissions.user");
  const { auth } = ctx.state;

  return sanitize.contentAPI.output(user, schema, { auth });
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

const updateUser = (userId, params) =>
  strapi.entityService.update("plugin::users-permissions.user", userId, params);

module.exports = {
  async updateMe(ctx) {
    const advancedConfigs = await strapi
      .store({ type: "plugin", name: "users-permissions", key: "advanced" })
      .get();

    const { id } = ctx.state.user;

    const user = await getService("user").fetch({ id });

    await validateUpdateUserBody(ctx.request.body);

    let updateData = {
      ...ctx.request.body
    };

    const data = await getService("user").edit(user.id, updateData);
    const sanitizedData = await sanitizeOutput(data, ctx);

    ctx.send(sanitizedData);
  },
  async adminUpdateUser(ctx) {
    const { id } = ctx.request.params;

    const user = await getService("user").fetch({ id });

    let updateData = {
      ...ctx.request.body
    };

    const data = await getService("user").edit(user.id, updateData);
    const sanitizedData = await sanitizeOutput(data, ctx);

    ctx.send(sanitizedData);
  },
  async me(ctx) {
    if(!ctx.state.user) {
      return ctx.unauthorized();
    }
    const user = await strapi.entityService.findOne(
      "plugin::users-permissions.user",
      ctx.state.user.id,
      { populate: ["avatar", "referredUsers"] }
    );

    const result = await sanitizeOutput(user, ctx);

    ctx.body = { ...result, hasPassword: user.password != null };
  },
  async avatar(ctx) {
    const { user: authUser } = ctx.state;
    const { files } = ctx.request;

    if (!files.avatar) {
      return ctx.badRequest(`you need to provide avatar file`);
    }

    await updateUser(authUser.id, {
      data: {
        avatar: null
      },
      populate: ["avatar"],
    });
    const user = await updateUser(authUser.id, {
      data: {},
      files: { avatar: files.avatar },
      populate: ["avatar"],
    });

    ctx.send(await sanitizeOutput(user, ctx));
  },
  async adminMe(ctx) {
    const { participant } = await strapi
      .service("api::participant.participant")
      .currentParticipant(ctx.state.user.id, {
        populate: [
          "team",
          "team.event",
          "team.tasks",
          "tasks",
          "seat",
          "seat.hall",
          "users_permissions_user",
          "users_permissions_user.avatar"
        ]
      });

    return {
      data: participant
    };
  },
  async adminUsers(ctx) {
    if(!ctx.state.user) {
      return ctx.unauthorized();
    }

    ctx.query = merge(ctx.query, {
      populate: [
        "referredBy", "participants", "participants.team", "participants.team.event"
      ]
    });

    const { results, pagination } = await strapi.entityService
      .findPage("plugin::users-permissions.user", ctx.query);

    const answers = await strapi.db
      .query("api::event-answer.event-answer").findMany({
        where: {
          user: {
            id: {
              $in: results.map(u => u.id)
            }
          }
        },
        populate: ['user', 'question']
      })

    return {
      data: results.map(r => ({
        ...r,
        activeParticipant: r.participants.find(p => p?.team?.event?.active),
        answers: answers.filter(a => a.user?.id === r.id)
      })),
      pagination
    };
  },
  async adminEditUsers(ctx) {
    if(!ctx.state.user) {
      return ctx.unauthorized();
    }

    return await strapi.db
      .query("plugin::users-permissions.user").updateMany(
        {
          where: ctx.query.filters,
          data: ctx.request.body.data
        }
      );
  },
  async adminCreateParticipants(ctx) {
    if(!ctx.state.user) {
      return ctx.unauthorized();
    }

    for (let i = 0;i < ctx.request.body.data.length;i++) {
      await strapi.db
        .query("api::participant.participant").create({
          data: ctx.request.body.data[i]
        });
    }

    return {
      ok: true
    }
  },
  async adminAddUser(ctx) {
    if(!ctx.state.user) {
      return ctx.unauthorized();
    }
    let user = ctx.request.body;

    user = await createUser(user);

    return {
      data: user
    };
  }
};
