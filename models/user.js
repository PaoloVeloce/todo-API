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
        password: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [7,100]
			}
		}
	}, {
		hooks: {
			beforeValidate: function (user, options) {
				if (typeof user.email === 'string') {
					user.email = user.email.toLowerCase();
				}
			}
		}
	});
};