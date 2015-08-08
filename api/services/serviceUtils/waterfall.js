var async = require('async');
var common = require('./common.js');

module.exports = function (services) {
  async.waterfall(services, common.responseAsJSON);
}
