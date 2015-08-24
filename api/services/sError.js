var _ = require('lodash');

var Errors = {
    Service: function (message) {
        this.error = 'E_SERVICE';
        this.status = 200;
        this.summary = message || "You may not access correctly.";
    },

    Grant: function (message) {
        this.error = 'E_GRANT';
        this.status = 200;
        this.summary = message || "You may need permission.";
    },

    Yet: function (message) {
        this.error = 'E_YET';
        this.status = 200;
        this.summary = message || "This function isn't implemented yet.";
    },

    Deprecated: function (message) {
        this.error = 'E_CLOSED';
        this.status = 200;
        this.summary = message || 'This function is deprecated.';
    }
};

function superError() {
    this.error = 'E_ERROR';
    this.status = 400;
    this.summary = 'An error occured.';
}

for (var idx in Errors) {
    Errors.prototype = new superError();
}

module.exports = Errors;
