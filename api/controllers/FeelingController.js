/**
 * FeelingController
 *
 * @description :: Server-side logic for managing Feelings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    addRecipe: function (req, res) {
        Feeling
            .findOne({
                id: req.param('id'),
            })
            .then(function (feeling) {
                feeling.recipes.add(req.param('recipe'));
                feeling.save(res.ok);
            })
            .catch(function (error) {
                sails.log(error);
                return res.serverError();
            });
    }
};
