module.exports = {
  routes: [
    {
      method: "GET",
      path: "/team/:id/manager",
      handler: "team.manager",
      config: {
        policies: [],
        middlewares: []
      }
    }
  ]
}
