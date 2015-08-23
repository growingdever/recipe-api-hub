/**
 * ViewController
 *
 * @description :: Server-side logic for managing Views
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    _config: {
        rest: true,
    },

    create: function (req, res) {
        View
            .create({
                user: req.user.id,
                recipe: req.param('id') || req.param('recipe'),
            })
            .then(function (view) {
                return res.ok(view);
            })
            .catch(function (error) {
                sails.log(error);

                return res.ok(error);
            });
    },

    destroy: function (req, res) {
        var criteria = {};
        var recipe = req.param('id');

        if (recipe) {
            criteria.recipe = parseInt(recipe);
        }

        async.waterfall([
            canDestroy,

            destroyView,
        ], serviceUtil.response(req, res));

        function canDestroy(cb) {
            if (req.user.isAdmin) {
                return cb();
            }

            View
                .find(criteria)
                .then(function (views) {
                    if (!views) {
                        return cb(new Error("User didn't view"));
                    }

                    return cb(null, views);
                })
                .catch(cb);
        }

        function destroyView(views, cb) {
            var matches = [];

            views.forEach(function (view, idx) {
                matches.push(view.id);
            });

            View
                .destroy(matches)
                .then(function (view) {
                    return cb(null, view);
                })
                .catch(cb);
        }
    }
};
