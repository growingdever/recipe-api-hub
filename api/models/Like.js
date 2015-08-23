/**
* Like.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
    schema: true,

    autoUpdatedAt: false,

    attributes: {
        /** @type {Object} 레시피 */
        recipe: {
            model: 'Recipe',
            required: true,
        },

        /** @type {Object} 유저 */
        user: {
            model: 'User',
            required: true,
        },
    },

    afterCreate: function(like, cb) {
        async.parallel([
            function addLikes(cb) {
                Recipe
                .findOne({
                    id: like.recipe,
                })
                .then(function(recipe) {
                    recipe.countLikes++;

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
                    event: 'like',
                    uid: like.user,
                    iid: like.recipe,
                })
                .then(function(res) {
                    return cb();
                })
                .catch(cb);
            },

        ], cb);
    },

    beforeDestroy: function(criteria, cb) {
        async.waterfall([
            bringLike,
            detachLike,
        ], cb);

        function bringLike(cb) {
            Like
            .findOne(criteria)
            .then(function (like) {
                return cb(null, like);
            })
            .catch(cb);
        }

        function detachLike(like, cb) {
            async.parallel([
                sendToML,
                decreaseCount,
            ], cb);

            function sendToML(cb) {
                var pioRecipe = Pio.getEvent('myRecipe');

                // TODO: delete like
                return cb();
            }

            function decreaseCount(cb) {
                Recipe
                .findOne({
                    id: like.recipe,
                })
                .then(function (recipe) {
                    recipe.countLikes--;
                    recipe.save(function (error, recipe) {
                        return cb(error);
                    });
                })
                .catch(cb);
            }
        }
    }
};
