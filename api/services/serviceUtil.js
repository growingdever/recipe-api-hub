module.exports = {
    response: function (req, res) {
        return function (error, result) {
            if (error) {
                if (error.error && error.error === 'E_VALIDATION') {
                    return res.ok(error);
                }

                sails.log(error);
                return res.serverError();
            }

            return res.ok(result);
        };
    },
};
