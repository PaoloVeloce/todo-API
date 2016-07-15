var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/basic-sqlite.sqlite'
});

var Todo = sequelize.define('todo', {
	description: {
		type: Sequelize.STRING,
		// description is no optional
		allowNull: false,
		validate: {
			len: [1, 250]
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
});
// force rewrite even if data also exists
sequelize.sync(/*{force: true}*/).then(function () {
	console.log('Everything is synced');
	
	
	Todo.findById(2).then(function (todo) {
		if (todo) {
			console.log(todo.toJSON());
		} else {
			console.log('Todo is not found');
		}
	});
	/*
	Todo.create({
		description: 'Go at home for rest',
		completed: false
	}).then(function (todo) {
		// inside then callback you can return a promise and keep chain going
		return Todo.create({
			description: 'Clean office'
		});
	}).then(function() {
		// return Todo.findById(1)
		return Todo.findAll({
			where: {
				description: {
					$like: '%office%'
				}
			}
		});
	}).then(function(todos) {
		if (todos) {
			todos.forEach(function (todo) {
				console.log(todo.toJSON());
			});
			
		} else {
			console.log('no todo found!');
		}
	}).catch(function (e) {
		console.log(e);
	})
	*/
});