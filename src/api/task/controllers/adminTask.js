"use strict";
/**
 *  task controller
 */

module.exports = {
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
