var express = require('express'),
		app = express(),
		path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
});

app.listen(3000, function () {
  console.log('Server listening on port 3000...');
});
