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

    let medals = {
      light: 0,
      rocket: 0,
      jet: 0
    };
    let userTasks = await strapi.db.query("api::task.task").findMany({
      where: {
        participant: {
          id: participant.id
        }
      }
    });
    userTasks.map(task => {
      if(task.medal) medals[task.medal] += 1;
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
        medals,
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
  },
  adminStats: async (ctx, next) => {
    const event = await strapi
      .service("api::event.event")
      .activeEvent();

    const { participant } = await strapi
      .service("api::participant.participant")
      .currentParticipant(ctx.state.user.id, {
        populate: ["team", "team.event", "team.tasks", "team.tasks.specialty", "tasks", "team.participants", "team.participants.users_permissions_user"]
      });

    let teams = await strapi.db.query("api::team.team").findMany({
      where: {
        event: {
          id: event.id
        }
      },
      populate: ["participants", "participants.users_permissions_user", "participants.tasks", "participants.tasks.specialty", "tasks", "tasks.specialty"]
    });

    let tasks = await strapi.db.query("api::task.task").findMany({
      where: {
        team: {
          event: event.id
        }
      },
      populate: ["participant", "specialty"]
    });

    let participants = await strapi.db.query("api::participant.participant").findMany({
      where: {
        team: {
          event: {
            id: event.id
          }
        },
        role: "teammate"
      },
      populate: ["users_permissions_user"]
    });

    let participantCounts = participantsCounter(participants);

    teams = teams.map((team) => ({
      ...team,
      specialty: teamTasksSpecialtyCounter(team.participants),
      participantsCount: team.participants.length,
      tasksStats: {
        total: team.tasks.length,
        totalTime: tasksTotalTime(team.tasks),
        ...tasksStatusCounter(team.tasks)
      }
    }));

    let users = await strapi.db.query("plugin::users-permissions.user").findMany({
      populate: ['participants']
    });

    return {
      data: {
        teams,
        users: {
          total: users.length,
          registered: _.filter(users, u => u.registered === true).length
        },
        participants: participantCounts,
        event: participant?.team?.event || event,
        team: participant ? {
          tasks: tasksStatusCounter(participant.team.tasks),
          participants: participantsCounter(_.filter(participant.team.participants, p => p.role === 'teammate')),
          specialty: tasksSpecialtyCounter(participant.team.tasks)
        } : undefined,
        tasks: {
          specialty: tasksSpecialtyCounter(tasks),
          total: tasks.length,
          totalTime: tasksTotalTime(tasks),
          assigned: tasks.filter(t => !!t.participant).length,
          ...tasksStatusCounter(tasks)
        }
      }
    };
  }
});

function tasksSpecialtyCounter(tasks) {
  const all = [];
  _.map(tasks, t => {
    t.specialty.map(s => all.push(s.value));
  });

  return {
    total: all.length,
    ..._.countBy(all, t => t)
  };
}

function teamTasksSpecialtyCounter(participants) {
  const all = {};
  const hasTasks = _.filter(participants, p => !!p.tasks && p.tasks.length > 0);
  _.map(hasTasks, p => {
    const pSpecialties = _.map(p.tasks, "specialty");
    const count = _.countBy(_.flatten(pSpecialties), s => s.value);
    const pSpecialty = { count: 0, value: "" };

    _.map(count, (count, key) => {
      if(pSpecialty.count < count) {
        pSpecialty.count = count;
        pSpecialty.value = key;
      }
    });

    if(pSpecialty.count > 0) {
      all[pSpecialty.value] = all[pSpecialty.value] || { participants: 0, hasUser: 0 };
      all[pSpecialty.value].participants += 1;
      if(!!p.users_permissions_user)
        all[pSpecialty.value].hasUser += 1;
    }
  });

  return {
    total: _.filter(participants, p => p.role === "teammate").length,
    ...all
  };
}

function participantsCounter(participants) {
  let participantCounts = {};
  participantCounts.present = _.filter(participants, p => !!p.enteredAt).length;
  participantCounts.absent = participants.length - participantCounts.present;
  participantCounts.hasUser = _.filter(participants, p => p.users_permissions_user && p.users_permissions_user.id).length;
  participantCounts.accepted = _.filter(participants, p => p.state === "accepted").length;
  participantCounts.userUnknown = _.filter(participants, p => p.state !== "invited" && p.users_permissions_user && p.users_permissions_user.id).length;
  participantCounts.invited = _.filter(participants, p => p.state === "invited").length;
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
