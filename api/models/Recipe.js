/**
* Recipe.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  schema: true,

  attributes: {
    /** @type {Object} 레시피 제목 */
    title: {
      type: 'string',
      minLength: 4, maxLength: 255,
      required: true,
    },

    /** @type {Object} 레시피 조리 방법 */
    method: {
      type: 'text',
      minLength: 10,
      required: true,
    },

    /** @type {Object} 레시피 썸네일 */
    thumbnail: {
      model: 'Resource',
      required: true,
    },

    /** @type {Object} 레시피 리뷰들 */
    reviews: {
      collection: 'Review',
      via: 'recipe',
    },

    /** @type {Object} 레시피가 받은 좋아요 */
    likes: {
      collection: 'Like',
      via: 'recipe',
    },

    /** @type {Object} 조회 기록 */
    views: {
      collection: 'View',
      via: 'recipe',
    },
  },
};
