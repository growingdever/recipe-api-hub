module.exports = {
  test: function () {
    console.log(this);
  },

  responseAsJSON: function (error, result) {
    if (error) {
      switch (typeof(error)) {
        case 'string':
          return res.ok({
            error: error
          });

          break;
        case 'object':
          return res.ok(error);

          break;
        default:
          break;
      }
    }

    return res.ok(result);
  }
};
