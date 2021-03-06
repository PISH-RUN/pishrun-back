"use strict";

/**
 *  participant controller
 */

const _ = require("lodash");

const { createCoreController } = require("@strapi/strapi").factories;
const utils = require("@strapi/utils");
const { NotFoundError } = utils.errors;

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
          populate: ["team", "team.event", "team.tasks", "tasks", "seat", "seat.hall", "users_permissions_user", "users_permissions_user.avatar"]
        });

      return {
        data: participant
      };
    },

    async all(ctx) {
      const { event } = await strapi
        .service("api::participant.participant")
        .currentParticipant(ctx.state.user.id, {
          populate: ["team", "team.event", "tasks", "seat", "seat.hall", "users_permissions_user"]
        });

      const participants = await strapi.db
        .query("api::participant.participant")
        .findMany({
          where: {
            team: {
              event: {
                id: event.id
              }
            }
          },
          populate: ["team", "users_permissions_user", "users_permissions_user.avatar"]
        });

      const teams = await strapi.db
        .query("api::team.team")
        .findMany({
          where: {
            event: {
              id: event.id
            }
          }
        });

      return {
        data: {
          teams,
          participantsState: {
            total: participants.length,
            present: _.filter(participants, p => p.enteredAt !== null).length,
            absent: _.filter(participants, p => p.enteredAt === null).length
          },
          participants: participants.map(participant => ({
            enteredAt: participant.enteredAt,
            firstName: participant.users_permissions_user?.firstName,
            lastName: participant.users_permissions_user?.lastName,
            avatar: participant.users_permissions_user?.avatar?.url,
            team: participant.team.id
          }))
        }
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

    async accept(ctx) {
      let { participant } = await strapi
        .service("api::participant.participant")
        .currentParticipant(ctx.state.user.id);

      if(!participant) {
        throw new NotFoundError("user participant not found");
      }

      participant = await strapi.db
        .query("api::participant.participant")
        .update({
          data: {
            state: "accepted"
          },
          where: {
            id: participant.id
          }
        });

      return {
        data: participant
      };
    },

    async reject(ctx) {
      let { participant } = await strapi
        .service("api::participant.participant")
        .currentParticipant(ctx.state.user.id);

      if(!participant) {
        throw new NotFoundError("user participant not found");
      }

      participant = await strapi.db
        .query("api::participant.participant")
        .update({
          data: {
            state: "rejected"
          },
          where: {
            id: participant.id
          }
        });

      return {
        data: participant
      };
    }
  })
);
