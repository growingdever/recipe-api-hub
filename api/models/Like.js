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

    afterCreate: function (like, cb) {
        Recipe
            .findOne({
                id: like.recipe,
            })
            .then(function (recipe) {
                recipe.countLikes++;

                recipe.save(cb);
            })
            .catch(cb);
    }
};
