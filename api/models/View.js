/**
* View.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
    schema: true,

    autoUpdatedAt: false,

    attributes: {
        /** @type {Object} 조회자 */
        user: {
            model: 'User',
            required: true,
        },

        /** @type {Object} 레시피 */
        recipe: {
            model: 'Recipe',
            required: true,
        }
    },

    afterCreate: function (view, cb) {
        async.parallel([
            function increaseViewCount(cb) {
                Recipe
                    .findOne({
                        id: view.recipe,
                    })
                    .then(function (recipe) {
                        recipe.countViews++;

                        recipe.save(function (error, recipe) {
                            return cb(error);
                        });
                    })
                    .catch(cb);
            },

            function sendToML(cb) {
                var pioRecipe = Pio.getEvent('myRecipe');

                pioRecipe
                    .createAction({
                        event: 'view',
                        uid: view.user,
                        iid: view.recipe,
                    })
                    .then(success)
                    .catch(cb);

                function success(res) {
                    return cb();
                }
            }
        ], cb);
    },

    beforeDestroy: function (criteria, cb) {
        async.waterfall([
            bringView,
            detachEvent,
        ], cb);

        function bringView(cb) {
            View
                .find(criteria)
                .exec(function (error, views) {
                    return cb(error, views);
                });
        }

        function detachEvent(views, cb) {
            async.each(views, eachView, cb);

            function eachView(view, cb) {
                async.parallel([
                    decreaseCount,
                    sendToML,
                ], cb);

                function decreaseCount(cb) {
                    Recipe
                        .findOne({
                            id: view.recipe,
                        })
                        .then(function (recipe) {
                            recipe.countViews--;

                            recipe.save(function (error, recipe) {
                                return cb(error);
                            });
                        })
                        .catch(cb);
                }

                function sendToML(cb) {
                    // TODO: unset pio
                    return cb();
                }
            }
        }
    }
};
