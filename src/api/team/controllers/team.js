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
        populate: ["participants", "participants.users_permissions_user", "participants.users_permissions_user.avatar"]
      });

      const manager = _.find(teams.participants, (p) => p.role === "manager");

      if(!manager || !manager.users_permissions_user) {
        return {
          ok: false,
          message: "manager not found for this team"
        };
      }

      return {
        data: {
          firstName: manager.users_permissions_user.firstName,
          lastName: manager.users_permissions_user.lastName,
          mobile: manager.users_permissions_user.mobile,
          avatar: manager.users_permissions_user.avatar
        }
      };
    },

    members: async (ctx, next) => {
      const { id } = ctx.request.params;
      let teamMembers = await strapi.db.query("api::participant.participant").findMany({
        where: {
          team: {
            id
          },
          role: "teammate"
        },
        populate: ["users_permissions_user", "tasks", "discussions"]
      });

      return {
        data: teamMembers.map(member => ({
          role: member.role,
          enteredAt: member.enteredAt,
          exitedAt: member.exitedAt,
          firstName: member.users_permissions_user?.firstName,
          lastName: member.users_permissions_user?.lastName,
          mobile: member.users_permissions_user?.mobile,
          tasks: {
            total: member.tasks.length,
            ...tasksStatusCounter(member.tasks)
          },
          taskState: taskStatus(member.tasks || []),
          discussions: member.discussions?.length || 0
        }))
      };
    }
  })
);

function tasksStatusCounter(tasks) {
  return tasks.reduce(
    (acc, curr) => {
      if(curr.status in acc) {
        acc[curr.status] += 1;
      }
      return acc;
    },
    {
      todo: 0,
      inprogress: 0,
      failed: 0,
      done: 0
    }
  );
}

function taskStatus(tasks) {
  const inProgress = _.find(tasks, { status: "inprogress" });
  if(inProgress) {
    const passedTime = (Date.now() - new Date(inProgress.beganAt).getTime()) / 1000 / 60;

    return (passedTime / inProgress.estimation) * 100;
  }

  return false;
}
