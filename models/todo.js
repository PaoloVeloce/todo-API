module.exports = function(sequelize, DataTypes) {
	return sequelize.define('todo', {
	description: {
		type: DataTypes.STRING,
		// description is no optional
		allowNull: false,
		validate: {
			len: [1, 250]
		}
	},
	completed: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
});
};

