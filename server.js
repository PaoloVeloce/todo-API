// import express module
var express = require('express');
// import bodyParser middleware = "software glue"
var bodyParser = require('body-parser');
// import underscore (strange sign)
var _ = require('underscore');
// import db.js file with database
var db = require('./db.js');
// import bcrypt-nodejs
var bcrypt = require('bcrypt-nodejs');


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
	var body = _.pick(req.body, 'description', 'completed');
	var attributes = {};
	
	
	
	// runs if the 'completed' exiscts and boolean
	if (body.hasOwnProperty('completed')) {
		attributes.completed = body.completed;
	}	
	if (body.hasOwnProperty('description')) {
		attributes.description = body.description;
	}
	
	 db.todo.findById(todoId).then(function (todo) {
		 if (todo) {
			 return todo.update(attributes).then(function (todo) {
		       res.json(todo.toJSON());
	 }, function (e) {
		 res.status(404).json(e);
	 });
		 } else {
			 res.status(404).send();
		 }
	 }, function() {
		 res.status(500).send();
	 });
	
});

// POST /users
app.post('/users', function (req, res) {
	var body = _.pick(req.body, 'email', 'password');
	
	db.user.create(body).then(function (user) {
		res.json(user.toPublicJSON());
	}, function(err) {
		res.status(400).json(err);
	});
});

// POST users/login
app.post('/users/login', function (req, res) {
	var body = _.pick(req.body, 'email', 'password');
	
	// validation semplice
	if (typeof body.email !== 'string' || typeof body.password !== 'string') {
		return res.status(400).send();
	}
	// checking if email matches request
	db.user.findOne({
		where: {
			email: body.email
		}
	}).then(function (user) {
		// comparing passwords with bcrypt !!! FLIPPING ))
		if (!user || !bcrypt.compareSync(body.password, user.get('password_hash'))) {
			return res.status(401).send(); // auth is possible but failed
		}
		// just to be in touch with hiding password for	
		res.json(user.toPublicJSON());
	}, function (e) {
		res.status(500).send();
	});
});


db.sequelize.sync().then(function (user) {
	// starting webserver and console.log text with server runnig message
  app.listen(PORT, function(req, res) {
	  console.log('Express is listening at port ' + PORT + '!');
  });
})

// ? that something after is a query parameters = set of key/value pairs

