/**
* Recipe.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
    schema: true,

    attributes: {
        // 음식 종류
        category: {
            model: 'category',
            required: true
        },

        // 식감
        feelings: {
            collection: 'feeling',
            via: 'recipes'
        },

        // 조리시간
        cooktime: {
            type: 'integer',
            defaultsTo: 0,
        },

        // 음식 양(인분)
        amount: {
            type: 'integer',
            defaultsTo: 0,
        },

        // 칼로리
        calorie: {
            type: 'integer',
            defaultsTo: 0,
        },

        // 영양분 - 탄수화물
        nutriment_carbohydrate: {
            type: 'integer',
            defaultsTo: 0,
        },

        // 영양분 - 단백질
        nutriment_protein: {
            type: 'integer',
            defaultsTo: 0,
        },

        // 영양분 - 지방
        nutriment_fat: {
            type: 'integer',
            defaultsTo: 0,
        },

        // 영양분 - 나트륨(소듐)
        nutriment_sodium: {
            type: 'integer',
            defaultsTo: 0,
        },

        // 보관온도
        temperature: {
            type: 'string',
            defaultsTo: '',
        },

        // 보관일
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

        // 썸네일
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

        countViews: {
            type: 'integer',
            defaultsTo: 0
        },

        countLikes: {
            type: 'integer',
            defaultsTo: 0
        },

        countReviews: {
            type: 'integer',
            defaultsTo: 0
        },

        toJSON: function() {
            var object = this.toObject();

            return object;
        }
    },

    afterCreate: function(recipe, cb) {
        async.parallel([
            function(cb) {
                Category
                .findOne({
                    id: recipe.category,
                })
                .then(function(category) {
                    category.countRecipes++;

                    category.save(function(error, category) {
                        return cb(error);
                    });
                })
                .catch(function(error) {
                    cb(error);
                });
            },
        ], cb);
    },

    beforeDestroy: function (criteria, cb) {
        async.waterfall([
            bringRecipe,

            decreaseCount,
        ], cb);

        function bringRecipe(cb) {
            Recipe
                .findOne(criteria)
                .then(function (recipe) {
                    return cb(null, recipe);
                })
                .catch(cb);
        }

        function decreaseCount(recipe, cb) {
            Category
                .findOne({
                    id: recipe.category,
                })
                .then(function (category) {
                    category.countRecipes--;

                    category.save(function (error, category) {
                        return cb(error);
                    });
                })
                .catch(cb);
        }
    }
};
