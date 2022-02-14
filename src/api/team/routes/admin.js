module.exports = {
  routes: [
    {
      method: "GET",
      path: "/admin/teams",
      handler: "team.adminTeams",
      config: {
        policies: [],
        middlewares: []
      }
    },
    {
      method: "GET",
      path: "/admin/team",
      handler: "team.adminTeam",
      config: {
        policies: [],
        middlewares: []
      }
    }
  ]
}
