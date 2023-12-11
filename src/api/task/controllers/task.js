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

    if (!participant) {
      return null;
    }

    ctx.query = merge(ctx.query, {
      filters: {
        $or: [
          {
            participant: { id: { $eq: participant.id } }
          },
          {
            canTake: true,
            participant: {
              id: {
                $null: true
              }
            }
          }
        ]
      },
    });

    return await super.find(ctx);
  },

  async findOne(ctx) {
    ctx.query = merge(ctx.query, {
      populate: {
        required_prerequisites: {
          populate: {
            files: {
              populate: '*'
            },
            participant: {
              populate: {
                users_permissions_user: {
                  fields: ['id', 'firstName', 'lastName']
                }
              }
            }
          }
        },
        prerequisites: {
          populate: {
            files: {
              populate: '*'
            },
            participant: {
              populate: {
                users_permissions_user: {
                  fields: ['id', 'firstName', 'lastName']
                }
              }
            }
          }
        }
      },
    });

    console.log(ctx.query)

    return await super.findOne(ctx);
  },

  async take(ctx) {
    const { id } = ctx.request.params;

    const { participant } = await strapi
      .service("api::participant.participant")
      .currentParticipant(ctx.state.user.id);
    const currentTask = await strapi.query("api::task.task").findOne({
      where: {
        id,
      },
      populate: ['participant']
    });

    if(!!currentTask.participant) {
      return {message: 'task already assigned'}
    }

    if(!currentTask.canTake) {
      return {message: 'task is not take-able'}
    }

    if(!participant) {
      return {message: 'participant not found'}
    }

    const task = await strapi.db.query("api::task.task").update({
      data: {
        participant: participant.id,
      },
      where: {
        id,
      },
    });

    return {
      data: task,
    };
  },

  async reject(ctx) {
    const { id } = ctx.request.params;
    const { parentTask } = ctx.request.body;

    const task = await strapi.db.query("api::task.task").findOne({
      where: {
        id,
      },
    });
    const mainTask = await strapi.db.query("api::task.task").findOne({
      populate: ['required_prerequisites'],
      where: {
        parentTask,
      },
    });

    const created = await strapi.db.query("api::task.task").create({
      data: {
        ...task
      }
    })

    await strapi.db.query("api::task.task").update({
      data: {
        required_prerequisites: [...mainTask.required_prerequisites, created.id]
      },
      where: {
        id: parentTask,
      },
    })

    await strapi.db.query("api::task.task").update({
      data: {
        status: 'failed'
      },
      where: {
        id,
      },
    })

    return {
      data: created,
    };
  },

  async bySlug(ctx) {
    const { slug } = ctx.request.params;

    console.log(slug)

    const task = await strapi.db.query("api::task.task").findOne({
      populate: {
        required_prerequisites: {
          populate: {
            files: {
              populate: ['*']
            },
            participant: {
              populate: {
                users_permissions_user: {
                  fields: ['id', 'firstName', 'lastName', 'username']
                }
              }
            }
          }
        },
        prerequisites: {
          populate: {
            files: {
              populate: ['*']
            },
            participant: {
              populate: {
                users_permissions_user: {
                  fields: ['id', 'firstName', 'lastName', 'username']
                }
              }
            }
          }
        }
      },
      where: {
        slug,
      },
    });

    return {
      data: {
        ...task,
        required_prerequisites: undefined,
        contents: task.required_prerequisites?.map(pTask => ({
          text: pTask.userDescription,
          user: {
            id: pTask?.participant?.users_permissions_user?.id,
            firstName: pTask?.participant?.users_permissions_user?.firstName,
            lastName: pTask?.participant?.users_permissions_user?.lastName,
            username: pTask?.participant?.users_permissions_user?.username,
          },
          files: pTask.files.map(f => f.url),
          slug: pTask.slug
        }))
      },
    };
  },

  async start(ctx) {
    const { id } = ctx.request.params;

    const task = await strapi.db.query("api::task.task").update({
      data: {
        beganAt: new Date(),
        status: "inprogress",
      },
      where: {
        id,
      },
    });

    return {
      data: task,
    };
  },

  async finish(ctx) {
    const { id } = ctx.request.params;
    const { userDescription } = ctx.request.body;
    const currentTask = await strapi.query("api::task.task").findOne({
      where: {
        id,
      },
    });

    let medal = null;
    let start = new Date(currentTask.beganAt);
    let finish = new Date();
    let duration = finish.getTime() - start.getTime();
    duration = duration / 60 / 1000; // convert to minutes
    let taskTime = currentTask.estimation;

    if (duration < taskTime) {
      let ratio = duration / taskTime;
      if (ratio <= 25) {
        medal = "light";
      } else if (ratio <= 50) {
        medal = "rocket";
      } else if (ratio <= 75) {
        medal = "jet";
      }
    }

    const task = await strapi.db.query("api::task.task").update({
      data: {
        finishedAt: new Date(),
        status: "done",
        userDescription: userDescription,
        medal,
      },
      where: {
        id,
      },
    });

    return {
      data: task,
    };
  },

  async suspend(ctx) {
    const { id } = ctx.request.params;

    const task = await strapi.db.query("api::task.task").update({
      data: {
        suspended: true,
      },
      where: {
        id,
      },
    });

    return {
      data: task,
    };
  },

  async unsuspend(ctx) {
    const { id } = ctx.request.params;

    const task = await strapi.db.query("api::task.task").update({
      data: {
        suspended: false,
      },
      where: {
        id,
      },
    });

    return {
      data: task,
    };
  },

  async fail(ctx) {
    const { id } = ctx.request.params;

    const task = await strapi.db.query("api::task.task").update({
      data: {
        status: "failed",
        finishedAt: new Date(),
      },
      where: {
        id,
      },
    });

    return {
      data: task,
    };
  },

  async discussions(ctx) {
    const { id } = ctx.request.params;

    const discussions = await strapi.db
      .query("api::discussion.discussion")
      .findMany({
        where: {
          task: {
            id,
          },
        },
        populate: ["participant", "participant.users_permissions_user", "task"],
      });

    return {
      data: discussions,
    };
  },

  async participant(ctx) {
    const { id } = ctx.request.params;

    const participant = await strapi.db
      .query("api::participant.participant")
      .findOne({
        where: {
          tasks: {
            id,
          },
        },
        populate: ["users_permissions_user", "users_permissions_user.avatar"],
      });

    return {
      data: participant ? {
        id: participant.id,
        firstName: participant.users_permissions_user?.firstName,
        lastName: participant.users_permissions_user?.lastName,
        avatar: participant.users_permissions_user?.avatar,
      } : {},
    };
  },

  async createMany(ctx) {
    const { tasks } = ctx.request.body;

    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i]
      ctx.request.body = { data: task };
      await super.create(ctx);
    }

    return { ok: true, created: tasks.length };
  },

  async file(ctx) {
    const { id } = ctx.request.params;
    const { files } = ctx.request;

    const currentTask = await strapi.query("api::task.task").findOne({
      where: {
        id,
      },
      populate: ["files"],
    });

    const response = await strapi.entityService.update("api::task.task", id, {
      data: {},
      files: { files: [...(currentTask.files || []), ...files.files] },
      populate: ["files"],
    });

    ctx.send(response);
  },
}));
