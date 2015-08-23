var _ = require('lodash');

var Errors = {
    Service: function (message) {
        this.error = 'E_SERVICE';
        this.status = 200;
        this.summary = message;
    },

    Grant: function (message) {
        this.error = 'E_GRANT';
        this.status = 200;
        this.summary = message;
    },
};

function superError() {
    this.error = 'E_ERROR';
    this.status = 400;
    this.code = 'ERROR';
    this.summary = 'An error occured.';
}

for (var idx in Errors) {
    Errors.prototype = new superError();
}

module.exports = Errors;
