const express = require('express');
const mongoose = require('./db/mongoose');
const ua_parser = require('ua-parser-js');
var bodyParser = require('body-parser')
const app = express();

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())


// const port = process.env.PORT || 3000;
const port = 3000;
const book = require('./routes/books');

const {Book} = require('./models/Book');
const {Quote} = require('./models/Quote');
const {Mistake} = require('./models/Mistake');

app.set('view engine', 'pug');
app.use(express.static('reader'));

app.get('/home', (req, res)=>{
	Book.find({}, function(err, books){
		if (err)
			res.send(err);
		res.render('index', {books});
	});
});

app.get('/quotes', (req, res)=>{
	Quote.find({}, function(err, quotes){
		if (err)
			res.send(err);
		res.render('quotes', {quotes});
	});
});

app.get('/mistakes', (req, res)=>{
	Mistake.find({}, function(err, mistakes){
		if (err)
			res.send(err);
		res.render('mistakes', {mistakes});
	});
});

app.get('/mist', (req, res)=>{
	Mistake.find({}, function(err, mistakes){
		if (err)
			res.send(err);
		res.send(mistakes);
	});
});

app.post('/savequote', (req, res)=>{
	const {title, quote} = req.body;
	new Quote({title, quote}).save((err, quote)=>{
		res.send('ok');
	})
});

app.post('/savemistake', (req, res)=>{
	const {title, quote, comment} = req.body;
	console.log(title);
	new Mistake({title, quote, comment}).save((err, mistake)=>{
		res.send('ok');
	})
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

app.use('/book', book);

// app.get('*', (req, res)=>{
// 	res.redirect('/reader');
// });

app.listen(port, ()=>console.log('server is running on port', port));

