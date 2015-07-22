/**
* Feel.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    /** @type {Object} 식감 이름 */
    name: {
      type: 'string',
      required: true,
      minLength: 3,
    },

    /** @type {Object} 등록된 레시피 */
    recipes: {
      collection: 'Recipe',
      via: 'feels',
    },
  }
};

