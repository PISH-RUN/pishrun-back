"use strict";

/**
 * participant service.
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService(
  "api::participant.participant",
  ({ strapi }) => ({
    async participant(userId, eventId, cfg = {}) {
      return await strapi.db.query("api::participant.participant").findOne({
        ...{
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
          populate: ["team", "tasks"],
        },
        ...cfg,
      });
    },

    async currentParticipant(userId, cfg = {}) {
      const event = await strapi.service("api::event.event").currentEvent();

      if (!event) {
        return null;
      }

      return await this.participant(userId, event.id, cfg);
    },
  })
);
