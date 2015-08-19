/**
* Recipe.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
    schema: true,

    attributes: {
        category: {
            model: 'category',
            required: true
        },
        feelings: {
            collection: 'feeling',
            via: 'recipes'
        },
        cooktime: {
            type: 'integer',
            defaultsTo: 0,
        },
        amount: {
            type: 'integer',
            defaultsTo: 0,
        },
        calorie: {
            type: 'integer',
            defaultsTo: 0,
        },
        temperature: {
            type: 'string',
            defaultsTo: '',
        },
        expire: {
            type: 'integer',
            defaultsTo: 0,
        },

        /** @type {Object} 레시피 제목 */
        title: {
            type: 'string',
            maxLength: 255,
            required: true,
        },

        /** @type {Object} 레시피 조리 방법 */
        methods: {
            collection: 'Method',
            via: 'recipe',
        },

        methodThumbs: {
            collection: 'Resource',
            via: 'recipe'
        },

        /** @type {Object} 레시피 썸네일 */
        thumbnail: {
            model: 'Resource',
            required: true,
        },

        /** @type {Object} 레시피 리뷰들 */
        reviews: {
            collection: 'Review',
            via: 'recipe',
        },

        /** @type {Object} 레시피가 받은 좋아요 */
        likes: {
            collection: 'Like',
            via: 'recipe',
        },

        /** @type {Object} 조회 기록 */
        views: {
            collection: 'View',
            via: 'recipe',
        },

        countViews: {type: 'integer', defaultsTo: 0},
        countLikes: {type: 'integer', defaultsTo: 0},
        countReviews: {type: 'integer', defaultsTo: 0},
    },

    afterCreate: function (recipe, cb) {
        async.parallel([
            function (cb) {
                Category
                    .findOne({
                        id: recipe.category,
                    })
                    .then(function (category) {
                        category.countRecipes++;

                        category.save(function (error, category) {
                            return cb(error);
                        });
                    })
                    .catch(function (error) {
                        cb(error);
                    });
            },
        ], cb);
    },
};
