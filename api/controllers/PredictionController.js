var request = require('request');

module.exports = {
    /**
     * Blueprint API option
     * @type {Object}
     */
    _config: {
        rest: true,
    },

    /**
     * API 사용법
     * GET /predictions?skip=0&limit=30
     * @param  {[type]} req [description]
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    find: function (req, res) {
        async.waterfall([
            // 추천 정보를 가져옴
            bringRecommendation,

            // 추천 정보와 레시피를 연결함
            matchRecipe,
        ], serviceUtil.response(req, res));

        function bringRecommendation(cb) {
            var user = req.user;
            if (!user) {
                return res.forbidden();
            }

            var pioRecipe = Pio.getClient('myRecipe');

            // display options
            var criteria = {
                skip    : parseInt(req.param('skip'))   || 0,
                limit   : parseInt(req.param('limit'))  || 15,
                user    : user.id,
            };
            criteria.limit += criteria.skip;

            // conditonal filters
            var where = req.param('where');
            if (where) {
                try {
                    where = JSON.parse(where);
                }
                catch (e) {
                    return cb(e);
                }

                if (where.feelings) {
                    criteria.feelings = where.feelings;
                }

                if (where.categories) {
                    criteria.categories = where.categories;
                }
            }

            pioRecipe
            .sendQuery(criteria)
            .then(function (result) {
                return cb(null, result.itemScores);
            })
            .catch(cb);
        }

        function matchRecipe(predictions, cb) {
            var matches = [];

            predictions.forEach(function (prediction, idx) {
                matches.push(prediction.item);
            });

            async.waterfall([
                bringRecipes,
                sortRecipes,
            ], done);

            function bringRecipes(cb) {
                Recipe
                    .find({
                        id: matches,
                    })
                    .then(function (recipes) {
                        return cb(null, recipes);
                    })
                    .catch(cb);
            }

            function sortRecipes(recipes, cb) {
                var sortedRecipes = [];

                matches.forEach(function (id, idx) {
                    id = parseInt(id);
                    
                    for ( var idx2 in recipes ) {
                        var recipe = recipes[idx2];

                        if (recipe.id === id) {
                            sortedRecipes.push(recipe);
                            delete recipes[idx2];

                            return;
                        }
                    }
                });

                return cb(null, sortedRecipes);
            }

            function done(error, recipes) {
                return cb(error, recipes);
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
