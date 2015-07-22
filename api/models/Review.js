/**
* Review.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  schema: true,

  attributes: {
    /** @type {Object} 작성자 */
    author: {
      model: 'User',
      required: true,
    },

    /** @type {Object} 레시피 */
    recipe: {
      model: 'Recipe',
      required: true,
    },

    /** @type {Object} 리뷰 내용 */
    content: {
      type: 'text',
      minLength: 10,
    },

    /** @type {Object} 리뷰 이미지 */
    image: {
      model: 'File'
    },
  }
};

