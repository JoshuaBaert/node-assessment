var express = require('express');
var bodyParser = require('body-parser');

var users = require('./users.json');


var app = express();

app.use(bodyParser.json());


app.get('/api/users', function (req, res, next) {
	var query = req.query;
	var queried = false;
	
	if (query.city === "scranton") {
		query.city = "Scranton"
	}
	
	for (var key in query) {
		queried = true;
		var qkey = key
	}
	
	
	if (queried) {
		var rtn = users.filter(function (ele, ind) {
			if (typeof ele[qkey] === "string") {
				return ele[qkey].toLowerCase() === query[qkey].toLowerCase();
			} else {}
			return ele[qkey] === query[qkey]
			
		});
		
		res.json(rtn)
	} else {
		res.json(users);
	}
	
});

app.get('/api/users/:id', function (req, res, next) {
	var id = req.params.id;
	
	
	if (parseInt(id)) {
		if (users.filter(function (ele, ind) {return ele.id === parseInt(id);})[0]) {
			res.json(users.filter(function (ele, ind) {
				return ele.id === parseInt(id);
			})[0]);
		} else {
			res.sendStatus(404);
		}
		
	} else {
		res.json(users.filter(function (ele, ind) {
			return ele.type === id;
		}));
	}
	
});


app.post('/api/users', function (req, res, next) {
	var user = {
		id: users.length + 1,
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		email: req.body.email,
		gender: req.body.gender,
		language: req.body.language,
		age: req.body.age,
		city: req.body.city,
		state: req.body.state,
		type: req.body.type,
		favorites: [
			req.body.favorites
		],
	};
	
	users.push(user);
	
	res.status(200).json(user);
	
});

app.post('/api/users/admin', function (req, res, next) {
	var user = {
		id: users.length + 1,
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		email: req.body.email,
		gender: req.body.gender,
		language: req.body.language,
		age: req.body.age,
		city: req.body.city,
		state: req.body.state,
		type: 'admin',
		favorites: [
			req.body.favorites
		],
	};
	
	users.push(user);
	
	res.status(200).json(user);
});

app.post('/api/users/language/:id', function (req, res, next) {
	var id = parseInt(req.params.id);
	var lang = req.body.language;
	var changed = false;
	users.map(function (ele, i) {
		if (ele.id === id ) {
			ele.language = lang;
			changed = true;
			res.json(users[i]);
		}
	});
	if (changed) {
		
	} else {
		res.sendStatus(400)
	}
});

app.post('/api/users/forums/:id',function (req, res, next) {
	var id = parseInt(req.params.id);
	var favorite = req.body.add;
	
	users.map(function (ele, i) {
		if (ele.id === id ) {
			ele.favorites.push(favorite);
			res.sendStatus(200);
		}
	})
	
});


app.put('/api/users/:id', function (req, res, next) {
	var id = parseInt(req.params.id);
	var userInfo = req.body;
	var changed = false;
	users.map(function (ele, i) {
		if (ele.id === id) {
			for (var key in userInfo) {
				ele[key] = userInfo[key];
				changed = true;
			}
			res.sendStatus(200);
		}
	});
	if (changed) {
		
	} else {
		res.sendStatus(400);
	}
});


app.delete('/api/users/forum/:id', function (req, res, next) {
	var id = parseInt(req.params.id);
	var favorite = req.query.favorite.toLowerCase();
	console.log('to delete favorite = ' + favorite);
	
	users.map(function (ele, i) {
		if (ele.id === id ) {
			ele.favorites.map(function (e, j) {
				if (e.toLowerCase() === favorite) {
					ele.favorites.splice(j,1);
					res.sendStatus(200)
				}
			})
		}
	})
});

app.delete('/api/users/:id',function (req, res, next) {
	var id = parseInt(req.params.id);
	var deleted = false;
	
	users.map(function (ele, i) {
		if (ele.id === id) {
			users.splice(i,1);
			res.sendStatus(200);
			deleted = true;
		}
	});
	if(deleted) {
		
	} else {
		res.sendStatus(404);
	}
});



app.listen(3000, function () {
	console.log('Listening on port 3000')
});

module.exports = app;