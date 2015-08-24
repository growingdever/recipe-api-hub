/**
 * LikeController
 *
 * @description :: Server-side logic for managing Likes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    create: create,

    destroy: destroy,
};

function create(req, res) {
    var recipe = req.param('id') || req.param('recipe');
    var user = req.user;

    async.waterfall([
        canLike,

        validRecipe,

        addLike,
    ], serviceUtil.response(req, res));

    function canLike(cb) {
        if (!user) {
            return cb(new sError.Grant('Like.Not.Authenticated'));
        }

        Like
            .findOne({
                user: user.id,
                recipe: recipe,
            })
            .then(function (like) {
                if (like) {
                    return cb(new sError.Service('Like.Duplicated'));
                }

                return cb();
            })
            .catch(cb);
    }

    function validRecipe(cb) {
        Recipe
            .findOne({
                id: recipe,
            })
            .then(function (recipe) {
                if (!recipe) {
                    return cb(new sError.Service('Like.Recipe.Not.Found'));
                }

                return cb();
            })
            .catch(cb);
    }

    function addLike(cb) {
        Like
            .create({
                user: user.id,
                recipe: recipe,
            })
            .then(function (like) {
                return res.ok(like);
            })
            .catch(function (error) {
                sails.log(error);

                return res.ok(error);
            });
    }
}

function destroy(req, res) {
    var criteria = {};
    var recipe = req.param('id');

    if (recipe) {
        criteria.recipe = recipe;
    }

    async.waterfall([
        canDestroy,

        destroyLike,
    ], serviceUtil.response(req, res));

    function canDestroy(cb) {
        if (req.user.isAdmin) {
            return cb();
        }

        Like
            .findOne(criteria)
            .then(function (like) {
                if (!like) {
                    return cb(new sError.Service('Like.Missing.Origin'));
                }

                return cb(null);
            })
            .catch(cb);
    }

    function destroyLike(cb) {
        Like
            .destroy(criteria)
            .then(function (like) {
                return cb(null, like);
            })
            .catch(cb);
    }
}
