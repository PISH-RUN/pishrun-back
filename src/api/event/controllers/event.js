"use strict";

/**
 *  event controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::event.event", ({ strapi }) => ({
  async find(ctx) {
    const event = await strapi.service("api::event.event").currentEvent();

    return {
      data: event,
    };
  },
}));
