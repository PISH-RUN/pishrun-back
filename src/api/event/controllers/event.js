"use strict";

/**
 *  event controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::event.event", ({ strapi }) => ({
  async find(ctx) {
    const event = await strapi.db.query("api::event.event").findOne({
      where: {
        is_performing: 1,
      },
    });

    return {
      data: event,
    };
  },
}));
