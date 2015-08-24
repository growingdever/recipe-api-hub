module.exports.routes = {
  '/': {
    view: 'homepage'
  },

  ///
  /// Authroizations
  ///
  'get /login': 'AuthController.login',
  'get /logout': 'AuthController.logout',
  'get /register': 'AuthController.register',

  'post /auth/local': 'AuthController.callback',
  'post /auth/local/:action': 'AuthController.callback',

  'get /auth/me': 'AuthController.me',
  'get /auth/:provider': 'AuthController.provider',
  'get /auth/:provider/callback': 'AuthController.callback',
  'get /auth/:provider/:action': 'AuthController.callback',

  ///
  /// Recipe
  ///
  'post /recipes/:recipe/feelings/:id': 'FeelingController.addRecipe',
  'delete /recipes/:recipe/feelings/:id': 'FeelingController.removeRecipe',

  ///
  /// Like
  ///
  'post /recipes/:id/likes': 'LikeController.create',
  'delete /recipes/:id/likes': 'LikeController.destroy',

  ///
  /// View
  ///
  'post /recipes/:id/views': 'ViewController.create',
  'delete /recipes/:id/views': 'ViewController.destroy',

  ///
  /// Review
  ///
  'get /recipes/:id/reviews': 'RecipeController.findReviews',

  ///
  /// Feeling
  ///
  'post /feelings/:id/recipes/:recipe': 'FeelingController.addRecipe',
  'delete /feelings/:id/recipes/:recipe': 'FeelingController.removeRecipe',

  ///
  /// Prediction
  ///
  'get /predictions': 'PredictionController.find',
};
