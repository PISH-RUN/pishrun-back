"use strict";
const merge = require("lodash/merge");
/**
 *  task controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::task.task", ({ strapi }) => ({
  async findOne(ctx) {
    const { id } = ctx.request.params;
    const task = await strapi.db.query("api::task.task").findOne({
      where: {
        id
      },
      populate: [
        "link",
        "specialty",
        "team",
        "event",
        "participant",
        "required_prerequisites",
        "prerequisites",
        "participant.users_permissions_user",
        "participant.users_permissions_user.avatar"
      ]
    });

    return {
      data: {
        ...task,
        participant: {
          ...task.participant,
          user: task.participant?.users_permissions_user,
          users_permissions_user: undefined
        }
      }
    };
  },

  async all(ctx) {
    ctx.query = merge(ctx.query, {
      populate: [
        "link",
        "specialty",
        "team",
        "event",
        "participant",
        "files",
        "participant.users_permissions_user",
        "participant.users_permissions_user.avatar"
      ]
    });

    const { results, pagination } = await strapi
      .entityService
      .findPage("api::task.task", ctx.query);

    return {
      data: results.map((t) => ({
        ...t,
        participant: {
          ...t.participant,
          user: t.participant?.users_permissions_user,
          users_permissions_user: undefined
        }
      })),
      pagination
    };
  },

  async deleteMany(ctx) {
    const ids = ctx.request.body.ids;

    if(ids)
      return await strapi.db.query("api::task.task").deleteMany({ where: { id: { $in: ids } } });

    return false;
  }
}));
