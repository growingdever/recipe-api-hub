var User = {
  // Enforce model schema in the case of schemaless databases
  schema: true,

  //
  attributes: {
    /** @type {Object} 유저 닉네임 */
    username: {
      type: 'string',
      unique: true,
      minLength: 2,
    },

    /** @type {Object} 유저 이메일 */
    email: {
      type: 'email',
      required: true,
      unique: true,
    },

    /** @type {Object} 유저 나이 */
    age: {
      type: 'integer',
      min: 1, max: 150,
      defaultsTo: 20,
    },

    /**
     * 유저 성별
     * 0: 등록 안됨
     * 1: 남자
     * 2: 여자
     * 3: 모름
     * 
     * @type {Object}
     */
    gender: {
      type: 'integer',
      min: 0, max: 3,
      defaultsTo: 0,
    },

    /** @type {Object} 비밀번호 */
    passports : {
      collection: 'Passport',
      via: 'user'
    }
  }
};

module.exports = User;
