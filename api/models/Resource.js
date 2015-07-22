/**
* Resource.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  schema: true,

  attributes: {
    /**
     * 이미지 여부
     * @type {Object}
     */
    isImage: {
      type: 'boolean',
      required: true,
      defaultsTo: false,
    },

    /**
     * 저장 주소
     * @type {Object}
     */
    reference: {
      type: 'string',
      required: true,
    },

    /**
     * 파일 원본 이름
     * @type {Object}
     */
    name: {
      type: 'string',
      required: true,
    },

    /** @type {Object} 파일 확장자 */
    ext: {
      type: 'string',
      required: true,
    },

    /** @type {Object} 파일 MINE type */
    type: {
      type: 'string',
      required: true,
    },
  }
};

