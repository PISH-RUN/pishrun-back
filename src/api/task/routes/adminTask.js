module.exports = {
  routes: [
    {
      method: "GET",
      path: "/admin/tasks",
      handler: "admin-task.all",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/admin/tasks/:id",
      handler: "admin-task.findOne",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/admin/tasks",
      handler: "task.create",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "PUT",
      path: "/admin/tasks/:id",
      handler: "task.update",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/admin/tasks/bulkDelete",
      handler: "admin-task.deleteMany",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "DELETE",
      path: "/admin/tasks/:id",
      handler: "task.delete",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/admin/tasks/createMany",
      handler: "task.createMany",
    },
  ],
};
