/**
 * FeelingController
 *
 * @description :: Server-side logic for managing Feelings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    addRecipe: addRecipe,
    removeRecipe: removeRecipe
};

function addRecipe(req, res) {
    async.waterfall([
        insertFeeling,
    ], serviceUtil.response(req, res));

    var feelingId = req.param('id');
    var recipeId = req.param('recipe');

    function insertFeeling(cb) {
        Feeling
            .findOne({
                id: feelingId,
            })
            .then(function (feeling) {
                feeling.recipes.add(recipeId);
                feeling.countRecipes++;

                feeling.save(function (error, feeling) {
                    return cb(error);
                });
            })
            .catch(cb);
    }
}

function removeRecipe(req, res) {
    async.waterfall([
        detachFeeling,
    ], serviceUtil.response(req, res));

    var feelingId = req.param('id');
    var recipeId = req.param('recipe');

    function deatchFeeling(cb) {
        Feeling
            .findOne({
                id: feelingId,
            })
            .then(function (feeling) {
                feeling.recipes.remove(recipeId);
                feeling.countRecipes--;

                feeling.save(function (error, feeling) {
                    return cb(error);
                });
            })
            .catch(cb);
    }
}
