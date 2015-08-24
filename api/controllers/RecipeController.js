/**
* RecipeController
*
* @description :: Server-side logic for managing Recipes
* @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
*/
var async = require('async');

module.exports = {
	/**
	 * Recipe RESTful API Get
	 * API Route: GET /recipes?skip=0&limit=30&where={}&sort=id ASC
	 */
	find: find,

	/**
	 * Recipe RESTful API Get One
	 * API Route: GET /recipes/:recipeId
	 */
	findOne: findOne,

	/**
	 * Recipe RESTful API Get associations
	 * API Route: GET /recipes/:recipeId/reviews
	 */
	findReviews: findReviews,
};

function find(req, res) {
	async.waterfall([
		findRecipes,
		matchLikes,
	], serviceUtil.reponse(req, res));

	// 레시피 조회
	function findRecipes(cb) {
		var criteria = {
			skip: parseInt(req.query.skip)		|| 0,
			limit: parseInt(req.query.limit)	|| 30,
			sort: req.query.sort 				|| 'id ASC',
			where: req.query.where
		};

		// string to JSON
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

		query
		.populate('thumbnail')
		.populate('feelings')
		.then(function(recipes) {
			return cb(null, recipes);
		})
		.catch(function(error) {
			return cb(error);
		});
	}

	// 이전 좋아요 기록 연결
	function matchLikes(recipes, cb) {
		if (!req.user) {
			return cb(null, recipes);
		}

		async.forEachOf(recipes, eachRecipe, done);

		function eachRecipe(recipe, index, cb) {
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
		}

		function done(error) {
			return cb(error, recipes);
		}
	}
}

function findOne(req, res) {
   async.waterfall([

	   findRecipe,

   ], serviceUtil.response(req, res));

   function findRecipe(cb) {
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
   }
}

function findReviews(req, res) {
	var recipeId = req.param('id');

	if (!recipeId) {
		return req.notFound();
	}

	async.waterfall([

		bringReviews,

	], serviceUtil.response(req, res));

	function bringReviews(cb) {
		Review
			.find({
				recipe: recipeId,
			})
			.populate('author')
			.then(function(reviews) {
				return cb(null, reviews);
			})
			.catch(cb);
	}
}
