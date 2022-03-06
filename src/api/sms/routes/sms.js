module.exports = {
  routes: [
    {
      method: "GET",
      path: "/admin/sms/bulk",
      handler: "sms.bulkSend",
      config: {
        policies: [],
        middlewares: []
      }
    },
    {
      method: "GET",
      path: "/admin/sms/pair",
      handler: "sms.pairSend",
      config: {
        policies: [],
        middlewares: []
      }
    }
  ]
};
