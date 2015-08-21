/**
 * async util functions
 */

module.exports = {
    userNewAction: function (userId) {
        return function (cb) {
            User
            .findOne({
                id: userId,
            })
            .then(function(user) {
                if (!user) {
                    return cb('User.NotFound');
                }

                user.countNewEvents++;
                user.save(cb);
            })
            .catch(cb);
        };
    }
};
