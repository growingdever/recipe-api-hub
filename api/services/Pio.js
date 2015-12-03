var PredictionIO = require('predictionio-driver');

var pioApps = {
    myRecipe: {
        eventURL: 'http://49.142.11.147:7070',
        queryURL: 'http://49.142.11.147:8000',
        appId: 3,
        accessKey: 'TqVUs1fgMlsPFB4uv0zO9xBgfwfBeLdCIKaLkb8OIsJ5qu0MbGrZA2H0XD9JAvT9',
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
