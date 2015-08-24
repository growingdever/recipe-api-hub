/**
 * ReviewController
 *
 * @description :: Server-side logic for managing Reviews
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    create: function (req, res) {
        var user = req.user;
        var data = req.allParams();

        async.waterfall([
            canReview,

            insertReview,
        ], serviceUtil.response(req, res));

        function canReview(cb) {
            if (!user) {
                return cb(new sError.Grant('Review.Not.Authenticated'));
            }

            Recipe
                .findOne({
                    id: data.recipe,
                })
                .then(function (recipe) {
                    if (!recipe) {
                        return cb(new sError.Service('Review.Not.Found.Recipe'));
                    }

                    return cb();
                })
                .catch(cb);
        }

        function insertReview(cb) {
            data.author = user.id;
            
            Review
                .create(data)
                .then(function (review) {
                    if (!review) {
                        return cb(new sError.Service('Review.Not.Registered'));
                    }

                    return cb(null, review);
                })
                .catch(cb);
        }
    }
};
