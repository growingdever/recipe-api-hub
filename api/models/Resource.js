/**
* Resource.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
    schema: true,

    attributes: {
        /**
        * 이미지 여부
        * @type {Object}
        */
        isImage: {
            type: 'boolean',
            required: true,
            defaultsTo: false,
        },

        /**
        * 저장 주소
        * @type {Object}
        */
        reference: {
            type: 'string',
            required: true,
        },

        recipe: {
            model: 'recipe',
        },

        toJSON: function () {
            var object = this.toObject();

            delete object.createdAt;
            delete object.updatedAt;
            delete object.id;

            return object;
        }
    }
};
