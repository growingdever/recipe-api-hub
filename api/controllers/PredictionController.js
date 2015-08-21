var request = require('request');

module.exports = {
    /**
     * Blueprint API option
     * @type {Object}
     */
    _config: {
        rest: true,
    },

    test: function (req, res) {
        var pioRecipe = Pio.getClient('myRecipe');
        var skip    = req.query.skip    || 0;
        var limit   = req.query.limit   || 15;

        pioRecipe.sendQuery({
            user: req.user.id,
            num: 300,
        })
        .then(function (result) {
            var predictions = result.itemScores;

            console.log(predictions);

            predictions = predictions.slice(skip, limit);

            console.log(skip, limit);
            console.log(predictions);

            var items = [];

            predictions.forEach(function (item, idx) {
                items.push(item.item);
            });

            Recipe
                .find({
                    id: items
                })
                .populate('thumbnail')
                .then(function (result) {
                    return res.ok(result);
                })
                .catch(function (error) {
                    sails.log(error);

                    return res.serverError();
                });
        });
    },

    /**
     * API 사용법
     * GET /predictions?skip=0&limit=30
     * @param  {[type]} req [description]
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    find: function (req, res) {
        var user = req.user;
        if (!user) {
            return res.forbidden();
        }

        // display options
        var criteria = {
            skip    : req.param('skip')     || 0,
            limit   : req.param('limit')    || 30,
            sort    : req.param('sort')     || 'score DESC',
        };

        // limit count of users' new event before request ML predictions.
        var stackLimit = 3;

        async.waterfall([
            updateCache,
            serveCache,
        ], serviceUtil.response(req, res));

        ////////////////

        function serveCache(cb) {
            criteria.user = user.id;

            Prediction
            .find(criteria)
            .exec(cb);
        }

        // update if user's actions are stacked
        function updateCache(cb) {
            console.log(user.countNewEvents, user.predictionCached);
            /*if (user.countNewEvents < stackLimit || user.predictionCached) {
                return cb();
            }*/

            async.waterfall([
                destroyCache,
                createCache,
                initializeUser,
            ], cb);

            // remove past
            function destroyCache(cb) {
                Prediction
                .destroy({
                    user: user.id,
                })
                .exec(cb);
            }

            // make forecast
            function createCache(cb) {
                var pioRecipe = Pio.getClient('myRecipe');

                pioRecipe.sendQuery({
                    user: req.user.id,
                    num: 300,
                })
                .then(function (result) {
                    var predictions = result.itemScores;

                    async.each(predictions, insertCache, cb);
                });

                function insertCache(prediction, cb2) {
                    Prediction
                    .create({
                        user: user.id,
                        item: parseInt(prediction.item),
                        score: prediction.score,
                    })
                    .then(function (res) {
                        return cb2();
                    })
                    .catch(cb2);
                }
            }

            /**
             * 유저 캐시 데이터를 업데이트합니다.
             * @param  {Function} cb [description]
             * @return {[type]}      [description]
             */
            function initializeUser(cb) {
                return cb();

                User
                .findOne({
                    id: user.id,
                })
                .then(function (user) {
                    user.countNewEvents = 0;
                    user.predictionCached = true;
                    user.save(cb);
                })
                .catch(cb);
            }
        }
    },

    findOne: function (req, res) {
        return res.ok({
            error: "E_NOT_SUPPORTED",
            message: "This function isn't supported"
        });
    },

    create: function (req, res) {
        return res.ok({
            error: "E_NOT_SUPPORTED",
            message: "This function isn't supported"
        });
    },

    destroy: function (req, res) {
        return res.ok({
            error: "E_NOT_SUPPORTED",
            message: "This function isn't supported"
        });
    },

    update: function (req, res) {
        return res.ok({
            error: "E_NOT_SUPPORTED",
            message: "This function isn't supported"
        });
    },
};
