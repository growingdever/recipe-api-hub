/**
* Attribute.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    label: {type: 'string', required: true, minLength: 2, maxLength: 10},
    type: {type: 'integer', enum: [0, 1, 2], required: true},
    recipes: {collection: 'recipe', via: 'attributes'},
  }
};
