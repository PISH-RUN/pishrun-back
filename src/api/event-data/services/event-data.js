'use strict';

/**
 * event-data service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::event-data.event-data');
