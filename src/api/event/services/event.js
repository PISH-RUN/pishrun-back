"use strict";
const merge = require("lodash/merge");

/**
 * event service.
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::event.event", ({ strapi }) => ({
  async currentEvent(cfg = {}) {
    let config = {
      where: {
        is_performing: 1,
      },
    };

    const event = await strapi.db
      .query("api::event.event")
      .findOne(merge(config, cfg));

    return event;
  },
  async activeEvent(cfg = {}) {
    let config = {
      where: {
        active: true,
      },
    };

    const event = await strapi.db
      .query("api::event.event")
      .findOne(merge(config, cfg));

    return event;
  },
}));
