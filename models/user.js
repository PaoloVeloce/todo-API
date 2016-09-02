var bcrypt = require('bcrypt-nodejs');
var _ = require('underscore');

module.exports = function(sequelize, DataTypes) {
	var user = sequelize.define('user', {
		// array of attributes
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true // do all complex validation
			}
		},
		// used in same 12345678 password for many users - salt crypt into another has
		salt: {
			type: DataTypes.STRING
		},
		password_hash: {
			type: DataTypes.STRING
		},
        password: {
			type: DataTypes.VIRTUAL,
			allowNull: false,
			validate: {
				len: [7,100]
			},
			set: function(value) {
				var salt = bcrypt.genSaltSync(10);
				var hashedPassword = bcrypt.hashSync(value, salt);
				
				this.setDataValue('password', value);
				this.setDataValue('salt', salt);
				this.setDataValue('password_hash', hashedPassword);
			}
		}
	}, {
		hooks: {
			beforeValidate: function (user, options) {
				if (typeof user.email === 'string') {
					user.email = user.email.toLowerCase();
				}
			}
		},
		classMethods: {
			authenticate: function (body) {
				return new Promise(function (resolve, reject) {
					// validation semplice
	                if (typeof body.email !== 'string' || typeof body.password !== 'string') {
	               	    return reject();
	                }
					
	                // checking if email matches request
	                user.findOne({
	                	where: {
		                	email: body.email
	            	    }
	                }).then(function (user) {
		             // comparing passwords with bcrypt !!! FLIPPING ))
		                if (!user || !bcrypt.compareSync(body.password, user.get('password_hash'))) {
		            	    return reject(); 
	                 	}
	             	    resolve(user);
	                }, function (e) {
	             	    reject();
	               });
				});
			}
		},
	    instanceMethods: {
			toPublicJSON: function () {
				var json = this.toJSON();
				return _.pick(json, 'id', 'email', 'updatedAt', 'createdAt');
			}
		}
	});
	
	return user;
};