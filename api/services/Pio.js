var PredictionIO = require('predictionio-driver');

var pioApps = {
    myRecipe: {
        eventURL: 'http://191.239.96.178:40002',
        queryURL: 'http://191.239.96.178:40003',
        appId: 4,
        accessKey: '5nxT9DmtEL3oyR4g5ifDsKdtCjT3t6RvdMgFEkTqBhHqbQ1eBlXpXtrda7hIdxZ3',
    },
};

var clients = {},
    events = {};

init();

function init() {
    for (var idx in pioApps) {
        var app = pioApps[idx];

        events[idx] = new PredictionIO.Events({
            appId: app.appId,
            accessKey: app.accessKey,
            url: app.eventURL,
        });

        clients[idx] = new PredictionIO.Engine({
            url: app.queryURL,
        });
    }
}

module.exports = (function () {
    return {
        getClient: getClient,
        getEvent: getEvent,
    };

    function getClient(app) {
        return clients[app];
    }

    function getEvent(app) {
        return events[app];
    }
})();
