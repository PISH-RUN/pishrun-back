"use strict";
const merge = require("lodash/merge");

/**
 *  task controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::task.task", ({ strapi }) => ({
  async find(ctx) {
    const { participant } = await strapi
      .service("api::participant.participant")
      .currentParticipant(ctx.state.user.id);

    if(!participant) {
      return null;
    }

    ctx.query = merge(ctx.query, {
      filters: { participant: { id: { $eq: participant.id } } }
    });

    return await super.find(ctx);
  },

  async start(ctx) {
    const { id } = ctx.request.params;

    const task = await strapi.db
      .query("api::task.task")
      .update({
        data: {
          beganAt: new Date(),
          status: "inprogress"
        },
        where: {
          id
        }
      });

    return {
      data: task
    };
  },

  async finish(ctx) {
    const { id } = ctx.request.params;
    const currentTask = await strapi
      .service("api::task.task")
      .findOne({
        where: {
          id
        }
      });

    let medal = null;
    let start = new Date(currentTask.beganAt);
    let finish = new Date();
    let duration = finish.getTime() - start.getTime();
    duration = duration / 60 / 1000; // convert to minutes
    let taskTime = currentTask.estimation;

    if(duration < taskTime) {
      let ratio = duration / taskTime;
      if(ratio <= 25) {
        medal = "light";
      } else if(ratio <= 50) {
        medal = "rocket";
      } else if(ratio <= 75) {
        medal = "jet";
      }
    }

    const task = await strapi.db
      .query("api::task.task")
      .update({
        data: {
          finishedAt: new Date(),
          status: "done",
          medal
        },
        where: {
          id
        }
      });

    return {
      data: task
    };
  },

  async suspend(ctx) {
    const { id } = ctx.request.params;

    const task = await strapi.db
      .query("api::task.task")
      .update({
        data: {
          suspended: true
        },
        where: {
          id
        }
      });

    return {
      data: task
    };
  },

  async unsuspend(ctx) {
    const { id } = ctx.request.params;

    const task = await strapi.db
      .query("api::task.task")
      .update({
        data: {
          suspended: false
        },
        where: {
          id
        }
      });

    return {
      data: task
    };
  },

  async fail(ctx) {
    const { id } = ctx.request.params;

    const task = await strapi.db
      .query("api::task.task")
      .update({
        data: {
          status: "failed"
        },
        where: {
          id
        }
      });

    return {
      data: task
    };
  },
}));
