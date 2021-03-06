var mongoose = require( 'mongoose' );
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

/** The user database schema */
var userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  hash: String,
  salt: String
});

/** Set user password */
userSchema.methods.setPassword = function(password){
  // Generating a slat in hex format & passing the password with the salt into
  // the hash function to securely store the password in database
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

/** Validate user password */
userSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
  return this.hash === hash;
};

/** Generate JSON Web Token */
userSchema.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);
  
  // Generating a new JWT file to store user session data
  return jwt.sign({
    _id: this._id,
    email: this.email,
    name: this.name,
    // The file expires in a give time
    exp: parseInt(expiry.getTime() / 1000),
  }, process.env.JWT_SECRET);
};

mongoose.model('User', userSchema);
