const express = require('express');

const {Book} = require('../models/Book');

const router = express.Router();


router.get('/addbook', (req, res)=>{
	const {title} = req.query;
	Book.findOne({title}, function(err, result){
		if (!result){
			const book = new Book({title});
			book.save((err, book)=>{
				if (err)
					res.send(err);
				res.send('book saved!');
			});
		}else{
			res.send('the book is already exists!');
		}
	});
});

router.get('/getbooks', (req, res)=>{
	Book.find({}, function(err, books){
		res.send(books);
	})
});

router.get('/chapters', (req, res)=>{
	Book.findOne({title:req.query.title}, (err, result)=>{
		if (err)
			res.send(err);
		res.send(result.chapters);
	});
});

router.post('/savequote', function(req, res){
	console.log(req.body);
	res.send(req.body);
});

router.post('/mistake', function(req, res){
	console.log(req.body);
	res.send(req.body);
});

router.get('/addchapter', (req, res)=>{
	const { title, cfi, label, chapterLength, chapterProgress } = req.query;
	Book.update({title}, {$push:{chapters: {cfi, label, chapterLength, chapterProgress}}}, (err, item)=>{
		if (err)
			res.send(err);
		res.send(item);
	});
});

module.exports = router;