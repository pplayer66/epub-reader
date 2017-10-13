const express = require('express');
const mongoose = require('./db/mongoose');
const ua_parser = require('ua-parser-js');
var bodyParser = require('body-parser')
const app = express();

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())


const port = process.env.PORT || 3000;
const book = require('./routes/books');

const {Book} = require('./models/Book');

app.set('view engine', 'pug');
app.use(express.static('reader'));

app.get('/home', (req, res)=>{
	Book.find({}, function(err, books){
		if (err)
			res.send(err);
		res.render('index', {books});
	});
});

app.get('/quote', (req, res)=>{
	res.render('quote', req.query);
});

app.get('/dropdb', (req, res)=>{
	mongoose.connection.db.dropDatabase(()=>{
		res.send('database has been dropped');
	});
});

app.get('/reader', (req, res)=>{
	const {book, title} = req.query;
	res.render('reader', {book, title});
});

// app.use('/reader/addbookmark', (req, res)=>{
// 	res.send({bookmark: req.query.bm});
// });

app.use('/book', book);

app.get('/device', (req, res)=>{
	const {device:{type}} = ua_parser(req.headers['user-agent']);
	console.log(type);
	res.send(type);

});

app.get('/browser', (req, res)=>{
	var ua = ua_parser(req.headers['user-agent']);
	res.send(ua.browser.name);
});

// app.get('*', (req, res)=>{
// 	res.redirect('/reader');
// });



// app.listen(port, ()=>console.log('server is running on port', port));

