"use strict";

/**
 *  team controller
 */

const _ = require("lodash");

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::team.team",
  ({ strapi }) => ({
    manager: async (ctx, next) => {
      const { id } = ctx.request.params;
      let teams = await strapi.db.query("api::team.team").findOne({
        where: { id },
        populate: ["participants", "participants.users_permissions_user"]
      });

      console.log(teams.participants);

      const manager = _.find(teams.participants, (p) => p.role === "manager");

      return {
        data: {
          firstName: manager.users_permissions_user.firstName,
          lastName: manager.users_permissions_user.lastName,
          mobile: manager.users_permissions_user.mobile,
        }
      };
    }
  })
);
