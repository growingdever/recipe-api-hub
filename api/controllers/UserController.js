/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	me: function (req, res) {
    res.ok(req.user);
  },

	update: function (req, res) {
		var params = req.paramAll();

		async.waterfall([
			function changePassword(cb) {
				if (!params.password) return cb();

				Passport
					.findOne({
						protocol: 'local',
						user: params.id
					})
					.then(function (passport) {
						if (!passport) {
							return cb('Error.Passport.NotFound');
						}

						passport.password = params.password;
						passport.save(function (error, passport) {
							if (error) {
								return cb(error);
							}

							return cb();
						});
					})
					.catch(function (error) {
						return cb(error);
					});
			},

			function findUser(cb) {
				User
					.findOneByIdentifier(params.identifier)
					.then(function (user) {
						
					})
					.catch(function (error) {
						return cb(error);
					});
			}
		], function (error, user) {

		});
	}
};
