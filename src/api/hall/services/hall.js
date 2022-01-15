'use strict';

/**
 * hall service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::hall.hall');
