// import express module
var express = require('express');
// import bodyParser middleware = "software glue"
var bodyParser = require('body-parser');
// import underscore (strange sign)
var _ = require('underscore');

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

// GET /todos
app.get('/todos', function (req, res) {
	res.json(todos);
});

// GET /todos/:id
app.get('/todos/:id', function( req, res) {
	// store the todoId and converting string to a number to (10 system)
	var todoId = parseInt(req.params.id, 10);
	// refactorin the code with underscore.js
	//findWhere returns only one argument from array(FIRST)
	var matchedTodo = _.findWhere(todos, {id: todoId});
	/* var matchedTodo;
	// with array we are checking if passed id eqal to id
	todos.forEach(function (todo) {
		if (todoId === todo.id) {
			matchedTodo = todo;
		}
	});
	*/
	if (matchedTodo) {
		res.json(matchedTodo);
	} else {
		res.status(404).send();
	}
	
	res.send('Asking for todo with id of ' + req.params.id)
});

// POST /todos/:id
app.post('/todos', function (req, res) {
	// create variable, which 
	var body = _.pick(req.body, 'description', 'completed');
	
	if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
		return res.status(400).send();
	}
	// prevents todo from entering 'only spaces' data
	body.description = body.description.trim();
	
	// add id field
	body.id = todoNextId;
	todoNextId++;
	// push body into array
	todos.push(body);
	
	console.log('description: ' + body.description);
	// 
	res.json(body);
});

// DELETE /todos/:id
app.delete('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});
	
	if (!matchedTodo) {
		res.status(404).json({"error": "no todo found with this id"});
	} else {
		todos = _.without(todos, matchedTodo);
		res.json(matchedTodo);
	}
});

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
	
})



// starting webserver and console.log text with server runnig message
app.listen(PORT, function(req, res) {
	console.log('Express is listening at port ' + PORT + '!');
})