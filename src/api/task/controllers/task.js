"use strict";
const merge = require("lodash/merge");

/**
 *  task controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::task.task", ({ strapi }) => ({
  async find(ctx) {
    const participant = await strapi
      .service("api::participant.participant")
      .currentParticipant(ctx.state.user.id);

    ctx.query = merge(ctx.query, {
      filters: { participant: { id: { $eq: participant.id } } },
    });

    return await super.find(ctx);
  },
}));
