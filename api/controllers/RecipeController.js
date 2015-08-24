/**
* RecipeController
*
* @description :: Server-side logic for managing Recipes
* @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
*/
var async = require('async');

module.exports = {
	find: function(req, res) {
		async.waterfall([
			findRecipes,
			matchLikes,
		], done);

		function done(error, recipes) {
			if (error) {
				sails.log(error);

				return res.serverError();
			}

			return res.ok(recipes);
		}

		function findRecipes(cb) {
			var criteria = {
				skip: parseInt(req.query.skip)		|| 0,
				limit: parseInt(req.query.limit)	|| 30,
				sort: req.query.sort 				|| 'id ASC',
				where: req.query.where
			};

			if (criteria.where) {
				try {
					criteria.where = JSON.parse(criteria.where);
				}
				catch (e) {
					return cb(e);
				}
			}
			else {
				delete criteria.where;
			}

			var query = Recipe.find(criteria);

			query.populate('thumbnail')
			.populate('feelings')
			.then(function(recipes) {
				return cb(null, recipes);
			})
			.catch(function(error) {
				return cb(error);
			});
		}

		function matchLikes(recipes, cb) {
			if (!req.user) {
				return cb(null, recipes);
			}

			async.forEachOf(recipes, function(recipe, index, cb) {
				Like
				.findOne({
					user: req.user.id,
					recipe: recipe.id,
				})
				.then(function(like) {
					if (like) {
						recipes[index].wasLiked = like.id;
					}

					return cb();
				})
				.catch(function(error) {
					return cb(error);
				});

			}, function(error) {
				return cb(error, recipes);
			});
		}
	},

	findOne: function(req, res) {
		async.waterfall([

			function(cb) {
				Recipe
				.findOne({
					id: req.param('id'),
				})
				.populate('thumbnail')
				.populate('feelings')
				.populate('reviews')
				.then(function(recipe) {
					if (req.user) {
						Like
						.findOne({
							user: req.user.id,
							recipe: recipe.id,
						})
						.then(function(like) {
							if (like) {
								recipe.wasLiked = like.id;
							}

							return cb(null, recipe);
						})
						.catch(cb);
					}
				})
				.catch(cb);
			},

		], serviceUtil.response(req, res));
	},

	findReviews: function(req, res) {
		var recipeId = req.param('id');

		if (!recipeId) {
			return req.notFound();
		}

		async.waterfall([

			function(cb) {
				Review
					.find({
						recipe: recipeId,
					})
					.populate('author')
					.then(function(reviews) {
						return cb(null, reviews);
					})
					.catch(cb);
			},

		], serviceUtil.response(req, res));
	}
};
