// modules
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var crypto = require('crypto');

// schemas
var UserSchema = mongoose.Schema({
	username: {
		type: String
	},
	password: {
		type: String
	},
	token: {
		type: String
	}
}, {
	timestamps: true
});

//----- model methods -----//

// pre save hook
UserSchema.pre('save', function(next) { // pre-save hook: BEFORE save happens
	if (this.isModified('password')) { // If the password has changed
		this.password = bcrypt.hashSync(this.password, 10); // hash the password
	}
	return next();
});

// set new token
UserSchema.methods.setToken = function(err, done) {
	var scope = this;
	crypto.randomBytes(256, function(err, buf) { // generating WEIRD token
		if (err) return done(err)
		scope.token = buf; // place token IN the user
		scope.save(function(err) { // save the user
			if (err) return done(err);
			done(); // Move on...
		});
	});
};

// Check if password attempt is correct
UserSchema.methods.authenticate = function(passwordTry, callback) {
	// Check if password is correct...
	bcrypt.compare(passwordTry, this.password, function(err, isMatch) {
		if (err) return callback(err);
		callback(null, isMatch);
	});
};


module.exports = mongoose.model('User', UserSchema);
