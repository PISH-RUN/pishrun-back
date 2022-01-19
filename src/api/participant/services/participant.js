"use strict";
const merge = require("lodash/merge");

/**
 * participant service.
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService(
  "api::participant.participant",
  ({ strapi }) => ({
    async participant(userId, eventId, cfg = {}) {
      const config = merge(cfg, {
        where: {
          users_permissions_user: {
            id: userId,
          },
          team: {
            event: {
              id: eventId,
            },
          },
        },
      });

      return await strapi.db
        .query("api::participant.participant")
        .findOne(config);
    },

    async currentParticipant(userId, cfg = {}) {
      const event = await strapi.service("api::event.event").currentEvent();

      if (!event) {
        return { event: null, participant: null };
      }

      const participant = await this.participant(userId, event.id, cfg);
      return { event, participant };
    },
  })
);
