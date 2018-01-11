const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String
});

// Encrypt user's password before save

userSchema.pre('save', function(next) {
  // get access to the user model
  const user = this;

  // generate a salt (with 10 salt rounds)
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);
    // hash user's password using the salt
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);
      // override plain text user's password with encrypted one
      user.password = hash;
      next();
    });
  });
});

// Compare passed (candidate) and actual passwords when user signs up

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  // bcrypt extracts actual salt and hashed password,
  // then it creates hash for candidate password
  // and compare two hashes indentity
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return callback(err);

    callback(null, isMatch);
  });
};

module.exports = mongoose.model('User', userSchema);