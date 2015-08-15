/**
* View.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
    schema: true,

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
        Recipe
            .findOne({
                id: view.recipe,
            })
            .then(function (recipe) {
                recipe.countViews++;

                recipe.save(cb);
            })
            .catch(cb);
    }
};
