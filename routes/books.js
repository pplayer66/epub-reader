const express = require('express');
const ua_parser = require('ua-parser-js');

const {Book} = require('../models/Book');

const router = express.Router();


router.get('/addbook', (req, res)=>{
	const book = new Book({title: req.query.title, total: req.query.total});
	book.save(
		(err, book)=>{
			if (err)
				res.send(err);
			res.send(book);
		}
	)
});

router.get('/all', (req, res)=>{
	Book.find({}, (err, books)=>{
		if (err)
			res.send(err);
		res.send(books);
	})
})

router.get('/pages', (req, res)=>{
	const {browser:{name}} = ua_parser(req.headers['user-agent']);
	Book.find({}, (err, result)=>{
		res.send(result[0][name]);
	});
})

router.get('/addpage', (req, res)=>{
	const {cfi, progress} = req.query;
	const {browser:{name}} = ua_parser(req.headers['user-agent']);
	Book.update({title: req.query.title}, {$push:{[name]: {cfi, progress}}}, (err, result)=>{
		if (err)
			res.send(err);
		res.send(result);
	});
});

router.get('/drop', (req, res)=>{
	Book.remove({}, (err, deleted)=>{
		if (err)
			res.send(err);
		res.send(deleted);
	})
});

module.exports = router;