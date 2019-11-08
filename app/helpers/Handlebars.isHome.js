'use strict';

/**
 * Expose helper
 */
module.exports = function (options) {
  return (this.id == 'home' || this.id == 'front') ? options.fn(this) : '';
}

