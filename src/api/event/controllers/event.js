"use strict";

const merge = require("lodash/merge");
/**
 *  event controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

const formatError = error => [
  { messages: [{ id: error.id, message: error.message, field: error.field }] }
];

module.exports = createCoreController("api::event.event", ({ strapi }) => ({
  async find(ctx) {
    const event = await strapi.service("api::event.event").currentEvent();

    return {
      data: event,
    };
  },
  async activeEvent() {
    const event = await strapi.service("api::event.event").activeEvent();

    return {
      data: event,
    };
  },
  async registerRequest(ctx) {
    const { slug } = ctx.request.params;
    const user = ctx.state.user.id;

    const event = await strapi.db
      .query("api::event.event")
      .findOne({
        where: {
          slug: slug
        },
        populate: ['participantRequests']
      });

    if(event.participantRequests.find(u => u.id === user)) {
      return ctx.badRequest(
        null,
        formatError({
          id: "event.request.register.exist",
          message: "Your are requested before."
        })
      );
    }

    await strapi.db
      .query("api::event.event")
      .update({
        where: {
          slug: slug
        },
        data: {
          participantRequests: [
            ...(event.participantRequests || [])?.map(u => u.id),
            user
          ]
        },
      });

    return {
      ok: true
    }
  },
  async eventData(ctx) {
    const { slug } = ctx.request.params;

    const event = await strapi.db
      .query("api::event.event")
      .findOne({
        where: {
          slug: slug
        },
        populate: ['data', 'data.introVideo', 'data.introImage', 'data.leader', 'data.leader.avatar']
      });

    let teams = await strapi.db.query("api::team.team").findMany({
      where: {
        event: {
          id: event.id
        }
      },
      populate: ['participants', "participants.users_permissions_user", "participants.users_permissions_user.avatar"]
    });

    return {
      data: {
        ...event,
        teams: teams.map(team => {
          const manager = team.participants.find(p => p.role === "manager");
          return {
            ...team,
            participants: team.participants.map(p => ({ ...p, user: p.users_permissions_user })),
            manager: manager ? {
              ...manager,
              users_permissions_user: undefined,
              firstName: manager.users_permissions_user?.firstName,
              lastName: manager.users_permissions_user?.lastName,
              avatar: manager.users_permissions_user?.avatar,
            } : undefined
          };
        }),
        data: {
          ...event?.data,
          leader: {
            avatar: event.data.leader.avatar,
            firstName: event.data.leader.firstName,
            lastName: event.data.leader.lastName
          }
        }
      },
    };
  },
}));
