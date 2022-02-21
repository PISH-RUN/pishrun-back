"use strict";

module.exports = {
  async all(ctx) {
    const participants = await strapi.entityService.findMany(
      "api::participant.participant",
      {
        filters: {
          role: "teammate",
        },
        populate: ["users_permissions_user", "tasks"],
      }
    );

    ctx.body = {
      data: participants.map((p) => ({
        ...p,
        users_permissions_user: undefined,
        user: p.users_permissions_user,
      })),
    };
  },

  async findOne(ctx) {
    const { id } = ctx.request.params;
    const participant = await strapi
      .query("api::participant.participant")
      .findOne({
        where: {
          id,
        },
        populate: ["users_permissions_user", "tasks"],
      });

    ctx.body = {
      data: {
        ...participant,
        tasks: participant.tasks,
        user: participant.users_permissions_user,
      },
    };
  },
};
