/**
* Like.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
    schema: true,

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

                    recipe.save(cb);
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

            serviceEvent.userNewAction(like.user),

        ], cb);
    },

    beforeDestroy: function(credential, cb) {
        Like
        .findOne(credential)
        .then(function(like) {
            var pioRecipe = Pio.getEvent('myRecipe');

            pioRecipe
            .createAction({
                event: 'cancel_like',
                uid: like.user,
                iid: like.recipe
            })
            .then(function() {
                return cb();
            })
            .catch(cb);
        })
        .catch(cb);
    }
};
