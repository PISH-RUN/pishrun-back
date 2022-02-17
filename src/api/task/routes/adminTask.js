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
      method: "POST",
      path: "/admin/tasks",
      handler: "task.create",
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
  ],
};
