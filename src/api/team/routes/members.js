module.exports = {
  routes: [
    {
      method: "GET",
      path: "/team/:id/members",
      handler: "team.members",
      config: {
        policies: [],
        middlewares: []
      }
    }
  ]
}
