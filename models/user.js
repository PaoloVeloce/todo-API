var bcrypt = require('bcrypt-nodejs');
var _ = require('underscore');

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('user', {
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
	    instanceMethods: {
			toPublicJSON: function () {
				var json = this.toJSON();
				return _.pick(json, 'id', 'email', 'updatedAt', 'createdAt');
			}
		}
	});
};