"use strict";

module.exports = {
  async all(ctx) {
    const participants = await strapi.entityService
      .findMany(
        "api::participant.participant",
        {
          filters: {
            role: 'teammate'
          },
          populate: ["users_permissions_user"]
        }
      );

    ctx.body = {
      data: participants.map(p => ({
        ...p,
        users_permissions_user: undefined,
        user: p.users_permissions_user
      }))
    };
  }
};