/**
* Ingredient.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    /** @type {Object} 재료 이름 */
    name: {
      type: 'string',
      minLength: 1,
    },

    /** @type {Object} 들어가는 레시피 */
    recipes: {
      collection: 'Recipe',
      via: 'ingredients',
    }
  }
};

