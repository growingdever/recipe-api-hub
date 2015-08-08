var common = require('./common.js');
var _ = require('lodash');

module.exports = _.assign(common, require('./waterfall.js'), require('./parallel.js'));
