"use strict";

/**
 * A set of functions called "actions" for `stat`
 */

module.exports = ({ strapi }) => ({
  stats: async (ctx, next) => {
    const { participant, event } = await strapi
      .service("api::participant.participant")
      .currentParticipant(ctx.state.user.id, { populate: ["team", "tasks"] });

    let teams = await strapi.db.query("api::team.team").findMany({
      where: {
        event: {
          id: event.id,
        },
      },
      populate: ["participants", "tasks"],
    });

    let participants = await strapi.db
      .query("api::participant.participant")
      .count({
        where: {
          team: {
            event: {
              id: event.id,
            },
          },
        },
      });

    teams = teams.map((team) => ({
      id: team.id,
      name: team.name,
      participants: team.participants.length,
      tasks: { total: team.tasks.length, ...tasksStatusCounter(team.tasks) },
    }));

    return { data: { team: participant.team, teams, participants } };
  },
});

function tasksStatusCounter(tasks) {
  return tasks.reduce(
    (acc, curr) => {
      if (curr.status in acc) {
        acc[curr.status] += 1;
      }
      return acc;
    },
    {
      todo: 0,
      inprogress: 0,
      done: 0,
    }
  );
}
