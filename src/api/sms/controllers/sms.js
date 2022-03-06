"use strict";

const _ = require("lodash");

/**
 * A set of functions called "actions" for `stat`
 */

module.exports = ({ strapi }) => ({
  bulkSend: async (ctx, next) => {
    const {receptors, messages} = ctx.request.body;

    await strapi.service("api::sms.sms").bulk(receptors, messages)

    return {
      ok: true
    }
  },
  pairSend: async (ctx, next) => {
    const {receptors, message} = ctx.request.body;

    await strapi.service("api::sms.sms").pair(receptors, message)

    return {
      ok: true
    }
  },
});
