
// import express module
var express = require('express');
var app = express();
// make PORT variable heroku ready
var PORT = process.env.PORT || 3000;

// add a root directory with text To Do API Root
app.get('/', function (req, res) {
	res.send('To Do API root page');
});

// starting webserver and console.log text with server runnig message
app.listen(PORT, function(req, res) {
	console.log('Express is listening at port ' + PORT + '!');
})