var validator = require('validator'),
    async = require('async');

var User = {
    // Enforce model schema in the case of schemaless databases
    schema: true,

    attributes: {
        isAdmin: {
            type: 'boolean',
            defaultsTo: false,
        },

        /** @type {Object} 유저 로그인 아이디 */
        username: {
            type: 'alphanumeric', unique: true,
            minLength: 6, maxLength: 20,
            required: true,
        },

        /** @type {Object} 유저 이메일 */
        email: {
            type: 'email', unique: true,
            required: true,
        },

        /** @type {Object} 유저 닉네임 */
        nickname: {
            type: 'string',
            minLength: 3, maxLength: 10,
            required: true,
        },

        /** @type {Object} 유저 나이 */
        age: {
            type: 'integer',
            max: 150,
            defaultsTo: -1,
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
            enum: [0, 1, 2, 3],
            defaultsTo: 0,
        },

        reviews: {
            collection: 'review',
            via: 'author',
        },

        countReviews: {type: 'integer', defaultsTo: 0},

        /** @type {Object} 비밀번호 */
        passports : {
            collection: 'Passport',
            via: 'user'
        }
    },

    findOneByIdentifier: function (identifier) {
        var isEmail = validator.isEmail(identifier);
        var condition = {};

        if (isEmail) {
            condition.email = identifier;
        }
        else {
            condition.username = identifier;
        }

        return User.findOne(condtion);
    },

    findOneByCredential: function (identifier, password, next) {
        async.waterfall([
            function findUser(cb) {
                User
                .findOneByIdentifier(identifier)
                .then(function (user) {
                    if (!user) {
                        return cb(isEmail ? 'Error.User.Email.NotFound' : 'Error.User.ID.NotFound');
                    }

                    cb(null, user);
                })
                .catch(function (error) {
                    cb(error);
                });
            },

            function validPassword(user, cb) {
                Passport
                .findOne({
                    user: user.id,
                    protocol: 'local'
                })
                .then(function (passport) {
                    if (!passport) {
                        return cb('Error.Passport.NotFound');
                    }

                    passport.validPassword(password, function (error, res) {
                        if (error) return cb(error);

                        if (res) {
                            // success
                            return cb(null, user);
                        }
                        else {
                            return cb('Error.Passport.Incorrect');
                        }
                    });
                })
                .catch(function (error) {
                    cb(error);
                });
            }
        ], next);
    },

    afterCreate: function (user, cb) {
        cb();
    }
};

module.exports = User;
