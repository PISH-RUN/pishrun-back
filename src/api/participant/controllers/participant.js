"use strict";

/**
 *  participant controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

const halls = {
  HT: 1,
  HB: 1,
  HC: 1,
  HS: 1,
  ER: 5,
  PR: 2
};

module.exports = createCoreController(
  "api::participant.participant",
  ({ strapi }) => ({
    async find(ctx) {
      const { participant } = await strapi
        .service("api::participant.participant")
        .currentParticipant(ctx.state.user.id, {
          populate: ["team", "team.event", "tasks", "seat", "seat.hall", "users_permissions_user"]
        });

      return {
        data: participant
      };
    },

    async enter(ctx) {
      const { slug } = ctx.request.body;
      const event = await strapi.service("api::event.event").currentEvent({
        where: {
          slug
        }
      });

      if(!event) {
        return null;
      }

      let participant = await strapi
        .service("api::participant.participant")
        .participant(ctx.state.user.id, event.id);

      if(!participant || participant.enteredAt) {
        return null;
      }

      participant = await strapi.db
        .query("api::participant.participant")
        .update({
          data: {
            enteredAt: new Date()
          },
          where: {
            id: participant.id
          }
        });

      return { data: participant };
    },

    async add(ctx) {
      const { prefix, count, team } = ctx.request.body;

      for (let i = 1; i <= count; i++) {
        let num = i;
        if(num < 10) num = `00${num}`;
        else if(num < 100) num = `0${num}`;
        else if(num > 1000) {
          return;
        }

        const seat = await strapi.db
          .query("api::seat.seat")
          .create({
            data: {
              slug: `${prefix}${num}`,
              hall: halls[prefix]
            }
          });

        await strapi.db
          .query("api::participant.participant")
          .create({
            data: { label: `${prefix}${num}`, team: team, seat: seat.id }
          });
      }

      return {
        data: true
      };
    }
  })
);
