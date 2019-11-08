'use strict';

/**
 * Expose helper
 */
module.exports = function (options) {
  return (this.id == 'article') ? options.fn(this) : '';
}

