const express = require('express');

const {Book} = require('../models/Book');

const router = express.Router();


router.get('/addbook', (req, res)=>{
	const book = new Book({title: req.query.title});
	book.save(
		(err, book)=>{
			if (err)
				res.send(err);
			res.send(book);
		}
	)
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
	const { title, chapter, progress, cfi, chapterTitle } = req.query;
	Book.update({title}, {$push:{chapters: {chapter, progress, cfi, chapterTitle}}}, (err, item)=>{
		if (err)
			res.send(err);
		res.send(item);
	});
});

module.exports = router;