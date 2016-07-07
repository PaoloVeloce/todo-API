
// import express module
var express = require('express');
// import bodyParser middleware = "software glue"
var bodyParser = require('body-parser');
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
	var matchedTodo;
	// with array we are checking if passed id eqal to id
	todos.forEach(function (todo) {
		if (todoId === todo.id) {
			matchedTodo = todo;
		}
	});
	
	if (matchedTodo) {
		res.json(matchedTodo);
	} else {
		res.status(404).send();
	}
	
	res.send('Asking for todo with id of ' + req.params.id)
});

// POST /todos/:id
app.post('/todos', function (req, res) {
	// create variable 
	var body = req.body;
	
	// add id field
	body.id = todoNextId;
	todoNextId++;
	// push body into array
	todos.push(body);
	
	console.log('description: ' + body.description);
	// 
	res.json(body);
});



// starting webserver and console.log text with server runnig message
app.listen(PORT, function(req, res) {
	console.log('Express is listening at port ' + PORT + '!');
})