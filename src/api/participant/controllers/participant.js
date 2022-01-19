"use strict";

/**
 *  participant controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::participant.participant",
  ({ strapi }) => ({
    async find(ctx) {
      const { participant } = await strapi
        .service("api::participant.participant")
        .currentParticipant(ctx.state.user.id, { populate: ["team", "tasks"] });

      return {
        data: participant,
      };
    },

    async enter(ctx) {
      const { slug } = ctx.request.body;
      const event = await strapi.service("api::event.event").currentEvent({
        where: {
          slug,
        },
      });

      if (!event) {
        return null;
      }

      let participant = await strapi
        .service("api::participant.participant")
        .participant(ctx.state.user.id, event.id);

      if (!participant || participant.enteredAt) {
        return null;
      }

      participant = await strapi.db
        .query("api::participant.participant")
        .update({
          data: {
            enteredAt: new Date(),
          },
          where: {
            id: participant.id,
          },
        });

      return { data: participant };
    },
  })
);
