"use strict";

const _ = require("lodash");

/**
 * A set of functions called "actions" for `stat`
 */

module.exports = ({ strapi }) => ({
  stats: async (ctx, next) => {
    const { participant, event } = await strapi
      .service("api::participant.participant")
      .currentParticipant(ctx.state.user.id, { populate: ["team", "tasks", "team.participants"] });

    let teams = await strapi.db.query("api::team.team").findMany({
      where: {
        event: {
          id: event.id
        }
      },
      populate: ["participants", "tasks"]
    });

    let tasks = await strapi.db.query("api::task.task").findMany({
      where: {
        team: {
          event: event.id
        }
      }
    });

    let participants = await strapi.db.query("api::participant.participant").findMany({
      where: {
        team: {
          event: {
            id: event.id
          }
        }
      }
    });

    let participantCounts = participantsCounter(participants);
    let teamParticipantCounts = participantsCounter(participant.team.participants);

    teams = teams.map((team) => ({
      id: team.id,
      name: team.name,
      participants: team.participants.length,
      tasks: {
        total: team.tasks.length,
        totalTime: tasksTotalTime(team.tasks),
        ...tasksStatusCounter(team.tasks)
      }
    }));

    return {
      data: {
        team: {
          ...participant.team,
          participants: teamParticipantCounts
        },
        teams,
        participants: participantCounts,
        tasks: {
          total: tasks.length,
          totalTime: tasksTotalTime(tasks),
          ...tasksStatusCounter(tasks)
        }
      }
    };
  }
});

function participantsCounter(participants) {
  let participantCounts = {};
  participantCounts.present = _.filter(participants, p => !!p.enteredAt).length;
  participantCounts.absent = participants.length - participantCounts.present;
  participantCounts.total = participants.length;

  return participantCounts;
}

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

function tasksTotalTime(tasks) {
  return tasks.reduce(
    (acc, curr) => {
      if(acc) {
        acc += curr.estimation;
      } else {
        acc = curr.estimation;
      }
      return acc;
    },
    0
  );
}
