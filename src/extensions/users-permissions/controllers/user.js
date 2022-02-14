"use strict";

const { getService } = require("../utils");
const { validateUpdateUserBody } = require("./validations/user");
const utils = require("@strapi/utils");
const { sanitize } = utils;

const sanitizeOutput = (user, ctx) => {
  const schema = strapi.getModel("plugin::users-permissions.user");
  const { auth } = ctx.state;

  return sanitize.contentAPI.output(user, schema, { auth });
};

module.exports = {
  async updateMe(ctx) {
    const advancedConfigs = await strapi
      .store({ type: "plugin", name: "users-permissions", key: "advanced" })
      .get();

    const { id } = ctx.state.user;

    const user = await getService("user").fetch({ id });

    await validateUpdateUserBody(ctx.request.body);

    let updateData = {
      ...ctx.request.body,
    };

    const data = await getService("user").edit(user.id, updateData);
    const sanitizedData = await sanitizeOutput(data, ctx);

    ctx.send(sanitizedData);
  },
  async me(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized();
    }
    const user = await strapi.entityService.findOne(
      "plugin::users-permissions.user",
      ctx.state.user.id,
      { populate: ["avatar", "referredUsers"] }
    );

    ctx.body = await sanitizeOutput(user, ctx);
  },
  async adminMe(ctx) {
    const { participant } = await strapi
      .service("api::participant.participant")
      .currentParticipant(ctx.state.user.id, {
        populate: ["team", "team.event", "team.tasks", "tasks", "seat", "seat.hall", "users_permissions_user", "users_permissions_user.avatar"]
      });

    return {
      data: participant
    };
  },
};
