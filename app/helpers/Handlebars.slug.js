'use strict';

const slug = require('slug');

/**
 * Expose helper
 */
module.exports = function (str) {
  return slug(str.toLowerCase ());
}
