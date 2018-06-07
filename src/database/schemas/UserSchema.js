const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const logger = require('./../../utils/Logger');
const Schema = mongoose.Schema;
const saltWorkFactor = 10;

let userSchema = new Schema({
  username: {type: String, required: true, index: {unique: true}},
  password: {type: String, required: true},
  firstName: String,
  lastName: String,
  roles: {type: Array}
});

userSchema.set('toObject', {
  transform: function (doc, ret, options) {
    delete ret._id;
    delete ret.__v;
  }
})

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

module.exports = userSchema;
