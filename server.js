// import express module
var express = require('express');
// import bodyParser middleware = "software glue"
var bodyParser = require('body-parser');
// import underscore (strange sign)
var _ = require('underscore');
// import db.js file with database
var db = require('./db.js');


var app = express();
// make PORT variable heroku ready
var PORT = process.env.PORT || 3000;
// store all todo items
var todos =[];
var todoNextId = 1;

// setupping middleware - when json parsed we have access to it in json.body
app.use(bodyParser.json());


// add a root directory with text To Do API Root
app.get('/', function (req, res) {
	res.send('To Do API root page');
});

// GET /todos?completed=true&q=work
app.get('/todos', function (req, res) {
	var query = req.query;
	var where = {};
	
	if (query.hasOwnProperty('completed') && query.completed === 'true') {
		where.completed = true;
	} else if (query.hasOwnProperty('completed') && query.completed === 'false') {
		where.completed = false;
	}
	
	if (query.hasOwnProperty('q') && query.q.length > 0) {
	   where.description = {
		   $like: '%' + query.q + '%'
	   };
}
	db.todo.findAll({ where: where}).then(function (todos) {
		res.json(todos);
	}, function () {
		res.status(500).send();
	})
	
/*	var filteredTodos = todos;
	// filtering by todo.completed status
	if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
		filteredTodos = _.where(filteredTodos, {completed: true});
	} else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
		filteredTodos = _.where(filteredTodos, {completed: false});
	}
	// searching by todo.desscription
	if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
		filteredTodos = _.filter(filteredTodos, function(todo) {
			return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
		});
	}
	
	res.json(filteredTodos);
	
*/
});

// GET /todos/:id
app.get('/todos/:id', function(req, res) {
	// store the todoId and converting string to a number to (10 system)
	var todoId = parseInt(req.params.id, 10);
	
	db.todo.findById(todoId).then(function (todo) {
		// if not a boolean (object, null) first ! flips to false, second to true
		if (!!todo) {
			res.json(todo.toJSON());
		} else {
			res.status(404).send();
		}
	}, function (e) {
		res.status(500).send();
	});
	
});

// POST /todos/:id
app.post('/todos', function (req, res) {
	// create variable, which 
	var body = _.pick(req.body, 'description', 'completed');
	
	db.todo.create(body).then(function (todo) {
		res.json(todo.toJSON())
	}, function (e) {
		res.status(400).json(e);
	})
});

//DELETE /todos/:id

app.delete('/todos/:id', function(req,res) {
	var todoId = parseInt(req.params.id, 10);
	
	db.todo.destroy({
		where: {
			id: todoId
		}
	}).then(function(rowsDeleted) {
		if (rowsDeleted === 0) {
			res.status(404).json({
				error: 'No todo with id'
			});
		} else {
			res.status(204).send();
		}
	}, function() {
		res.status(500).send();
	})
})

// PUT /todos/:id
app.put('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);	
	var matchedTodo = _.findWhere(todos, {id: todoId});
	var body = _.pick(req.body, 'description', 'completed');
	var validAttributes = {};
	
	if (!matchedTodo) {
		return res.status(404).send();
	}
	
	
	// runs if the 'completed' exiscts and boolean
	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;
	// runs if exists and not a boolean, so smth went wrong
	} else if (body.hasOwnProperty('completed')) {
		return res.status(400).send(); 
	} 
	
	if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
		validAttributes.description = body.description;
	} else if (body.hasOwnProperty('description')) {
		return res.status(400).send();
	}
	
	_.extend(matchedTodo, validAttributes);
	res.json(matchedTodo);
	
});

db.sequelize.sync().then(function () {
	// starting webserver and console.log text with server runnig message
  app.listen(PORT, function(req, res) {
	  console.log('Express is listening at port ' + PORT + '!');
  });
})

// ? that something after is a query parameters = set of key/value pairs

