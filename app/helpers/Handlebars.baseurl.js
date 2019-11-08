'use strict';

const {
  get
} = require('hephaestus');

/**
 * Expose helper
 */
module.exports = function (str) {
  if (typeof str === 'string' || str instanceof String) {
    return `${get('APP_URL')}/${str}`;
  } else {
    return `${get('APP_URL')}`;
  }
}
