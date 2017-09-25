const express = require('express');

const {Book} = require('../models/Book');

const router = express.Router();


router.get('/add', (req, res)=>{
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
	Book.find({}, (err, result)=>{
		res.send(result[0].pages);
	});
})

router.get('/addpage', (req, res)=>{
	const {cfi, progress} = req.query; 
	Book.update({title: req.query.title}, {$push:{pages: {cfi, progress}}}, (err, result)=>{
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