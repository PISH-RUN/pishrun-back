"use strict";

/**
 *  participant controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::participant.participant",
  ({ strapi }) => ({
    async find(ctx) {
      const currentEvent = await strapi.db.query("api::event.event").findOne({
        select: ["id"],
        where: {
          is_performing: 1,
        },
      });

      const participant = await strapi.db
        .query("api::participant.participant")
        .findOne({
          where: {
            users_permissions_user: {
              id: ctx.state.user.id,
            },
            team: {
              event: {
                id: currentEvent.id,
              },
            },
          },
          populate: ["team", "tasks"],
        });

      return {
        data: participant,
      };
    },

    async enter(ctx) {
      const { slug } = ctx.request.body;
      const currentEvent = await strapi.db.query("api::event.event").findOne({
        select: ["id"],
        where: {
          slug: slug,
          is_performing: 1,
        },
      });

      if (!currentEvent) {
        return null;
      }

      const participant = await strapi.db
        .query("api::participant.participant")
        .update({
          data: {
            enteredAt: new Date(),
          },
          where: {
            enteredAt: null,
            users_permissions_user: {
              id: ctx.state.user.id,
            },
            team: {
              event: {
                id: currentEvent.id,
              },
            },
          },
        });

      return { data: participant };
    },
  })
);
