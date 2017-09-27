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

router.get('/all', (req, res)=>{
	Book.find({}, (err, books)=>{
		if (err)
			res.send(err);
		res.send(books);
	})
})

router.get('/device', (req, res)=>{
	var ua = ua_parser(req.headers['user-agent']);
	res.send(ua.browser.name);
});

router.get('/pages', (req, res)=>{
	const {title, size} = req.query;
	const {browser:{name}} = ua_parser(req.headers['user-agent']);
	if (name === 'Mobile Safari')
		name = 'MobileSafari';
	Book.findOne({title}, (err, result)=>{
		const pages = result[name].filter((item)=>{
			if (item.size === size)
				return item;
		});
		res.send(pages);
	});
})

router.get('/addpage', (req, res)=>{
	const {title, cfi, progress, size} = req.query;
	const {browser:{name}} = ua_parser(req.headers['user-agent']);
	if (name === 'Mobile Safari')
		name = 'MobileSafari';
	Book.update({title: req.query.title}, {$push:{[name]:{cfi, progress, size}}}, (err, result)=>{
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

router.get('/remove', (req, res)=>{ //rm by cfi _id
	const {id, browser, idcfi} = req.query;
	Book.update({_id: id}, {$pullAll:{[browser]:[{}]}}, {safe: true, multi: true}, (err, doc)=>{
		if (err)
			console.log(err);
		console.log(doc);
	});
});

router.get('/rm', (req, res)=>{
	Book.update({_id: '59cb5c4767afe20012535739'}, {$set: {Safari:[]}}, (err, docs)=>{
		res.send(docs);
	});
});

module.exports = router;