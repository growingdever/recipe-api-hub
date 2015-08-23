/**
* Method.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
    attributes: {
        recipe: {
            model: 'recipe',
            required: true
        },
        
        content: {
            type: 'string'
        },

        toJSON: function () {
            var object = this.toObject();

            delete object.createdAt;
            delete object.updatedAt;

            return object;
        }
    }
};
