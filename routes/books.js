const express = require('express');
const ua_parser = require('ua-parser-js');

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

router.get('/addchapter', (req, res)=>{
	const { title, chapter, progress } = req.query;
	Book.update({title}, {$push:{chapters: {chapter, progress}}}, (err, item)=>{
		if (err)
			res.send(err);
		res.send(item);
	});
});

module.exports = router;