
// import express module
var express = require('express');
var app = express();
// make PORT variable heroku ready
var PORT = process.env.PORT || 3000;
// store all todo items
var todos =[{
	id: 1, 
	description: 'Meet wife for lunch',
	completed: false
}, {
	id: 2,
	descriprion: 'Follow the white rabbit',
	completed: false
}, {
	id: 3, 
	description: 'Go to sauna',
	completed: true
}];

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


// starting webserver and console.log text with server runnig message
app.listen(PORT, function(req, res) {
	console.log('Express is listening at port ' + PORT + '!');
})