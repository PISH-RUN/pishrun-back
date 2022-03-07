"use strict";

const _ = require("lodash");

/**
 * A set of functions called "actions" for `stat`
 */

module.exports = ({ strapi }) => ({
  send: async (ctx, next) => {
    console.log(ctx);
    const {receptors, template, params} = ctx.request.body;

    receptors.map((receptor, index) => {
      strapi.service("api::sms.sms").sendSms(receptor, template, params[index])
    })

    return {
      ok: true
    }
  }
});
