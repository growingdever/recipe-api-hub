/**
 * CategoryController
 *
 * @description :: Server-side logic for managing Categories
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    find: function (req, res) {
        async.waterfall([
            bringCategories,
        ], serviceUtil.response(req, res));

        function bringCategories(cb) {
            Category
                .find({
                    where: {
                        countRecipes: {
                            '>': 0,
                        }
                    },
                })
                .then(function (res) {
                    return cb(null, res);
                })
                .catch(cb);
        }
    }
};
