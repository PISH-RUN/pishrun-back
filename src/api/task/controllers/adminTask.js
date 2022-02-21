"use strict";
/**
 *  task controller
 */

module.exports = {
  async findOne(ctx) {
    const { id } = ctx.request.params
    const task = await strapi.db
      .query("api::task.task")
      .findOne({
        where: {
          id
        },
        populate: ["link", "team", "event", "participant", "participant.users_permissions_user", "participant.users_permissions_user.avatar"]
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
  async all() {
    const tasks = await strapi.db
      .query("api::task.task")
      .findMany({
        populate: ["link", "team", "event", "participant", "participant.users_permissions_user", "participant.users_permissions_user.avatar"]
      });

    return {
      data: tasks.map(t => ({
        ...t,
        participant: {
          ...t.participant,
          user: t.participant?.users_permissions_user,
          users_permissions_user: undefined
        }
      }))
    };
  },
};
