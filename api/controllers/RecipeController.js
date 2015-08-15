/**
 * RecipeController
 *
 * @description :: Server-side logic for managing Recipes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	find: function (req, res) {
		var query = Recipe
			.find()
			.sort(req.query.sort || 'id ASC')
			.skip(parseInt(req.query.skip) || 0)
			.limit(parseInt(req.query.limit) || 30)
			.populate('thumbnail')
			.then(function (recipes) {
				res.ok(recipes);
			})
			.catch(function (error) {
				res.ok(error);
			});
	},

	findOne: function (req, res) {
		Recipe
			.findOne({
				id: req.param('id'),
			})
			.populate('thumbnail')
			.then(function (recipe) {
				res.ok(recipe);
			})
			.catch(function (error) {
				res.ok(error);
			});
	},
};
