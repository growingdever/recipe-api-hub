var User = {
  // Enforce model schema in the case of schemaless databases
  schema: true,

  //
  attributes: {
    username: {
      type: 'string',
      unique: true,
      required: true,
    },
    
    email: {
      type: 'email',
      unique: true,
      required: true,
    },

    age: {
      type: 'integer',
      min: 12, max: 150,
      defaultsTo: 20,
    },

    gender: {
      type: 'integer',
      min: 0, max: 2,
      defaultsTo: 0,
    },

    passports: {
      collection: 'Passport',
      via: 'user'
    }
  }
};

module.exports = User;
