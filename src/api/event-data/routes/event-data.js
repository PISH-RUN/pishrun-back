'use strict';

/**
 * event-data router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::event-data.event-data');
