module.exports = {
    response: function (req, res) {
        return function (error, result) {
            if (error) {
                if (error.error) {
                    return res.ok(error);
                }

                sails.log(error);
                return res.serverError();
            }

            return res.ok(result);
        };
    },

    create: function (req, res, Model) {
        return function (req, res) {
            var services = req.sails.services;
            var serviceUtil = services.serviceUtil;
            var sError = services.sError;

            var data = req.allParams();

            async.waterfall([], serviceUtil.response(req, res));

            function createModel(cb) {
                Model
                .create(data)
                .then(function (error, model) {
                    if (!error && !model) {
                        return cb(new sError('Model.Failed.Create'));
                    }

                    return cb(error, model);
                });
            }
        };
    }
};
