/**
* Category.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    attributes: {
        label: {
            type: 'string',
            required: true,
            unique: true,
        },

        recipes: {
            collection: 'recipe',
            via: 'category'
        },

        countRecipes: {
            type: 'integer',
            defaultsTo: 0
        },

        toJSON: function () {
            var object = this.toObject();

            delete object.createdAt;
            delete object.updatedAt;

            return object;
        }
    }
};
