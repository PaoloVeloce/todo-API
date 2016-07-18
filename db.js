var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/data/dev-todo-api.sqlite'
});

var db = {};

db.todo = sequelize.import(__dirname + '/models/todo.js');
// sequlize instance
db.sequelize = sequelize;
// sequlize library
db.Sequlize = Sequelize;

module.exports = db;