const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const logger = require('./../../utils/Logger');
const Schema = mongoose.Schema;
const saltWorkFactor = 10;

let userSchema = new Schema({
  username: {type: String, required: true, index: {unique: true}},
  password: {type: String, required: true},
  firstName: String,
  lastName: String
});

userSchema.pre('save', function (next) {
  let user = this;
  if (!user.isModified('password')) {
    return next();
  }

  bcrypt.genSalt(saltWorkFactor, function (err, salt) {
    if (err) {
      return next();
    }
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) {
        return next();
      }
      user.password = hash;
      next();
    })
  })
});

userSchema.methods.comparePasswords = function (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) {
      return callback(err);
    }
    return callback(null, isMatch);
  })
};

module.exports = userSchema;
