module.exports = {
  routes: [
    {
      method: "GET",
      path: "/event",
      handler: "event.find",
    },
    {
      method: "GET",
      path: "/eventData/:slug",
      handler: "event.eventData",
    },
    {
      method: "POST",
      path: "/event-register/:slug",
      handler: "event.registerRequest",
    },
    {
      method: "GET",
      path: "/admin/event",
      handler: "event.activeEvent",
    },
  ],
};
