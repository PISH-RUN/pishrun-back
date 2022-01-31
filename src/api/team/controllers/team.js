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

      const manager = _.find(teams.participants, (p) => p.role === "manager");

      if(!manager || !manager.users_permissions_user){
        return {
          ok: false,
          message: 'manager not found for this team'
        }
      }

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
