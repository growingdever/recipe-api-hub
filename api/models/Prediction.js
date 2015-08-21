module.exports = {
    attributes: {
        user: {
            model: 'user',
            required: true,
        },

        score: {
            type: 'float',
            defaultsTo: 0,
        },

        item: {
            model: 'Recipe',
            required: true,
        },
    },
};
