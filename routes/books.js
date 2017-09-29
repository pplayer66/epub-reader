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

router.get('/pages', (req, res)=>{
	const {title} = req.query;
	var {browser:{name}, device:{type}} = ua_parser(req.headers['user-agent']);
	const devtype = !type ? 'desktop' : 'mobile';
	if (name === 'Mobile Safari')
		name = 'MobileSafari';
	Book.findOne({title}, (err, result)=>{
		const pages = result[name].filter((item)=>{
			if (item.devtype === devtype)
				return item;
		});
		res.send(pages);
	});
})

router.get('/addpage', (req, res)=>{
	const {title, cfi, progress, size} = req.query;
	var {browser:{name}, device:{type}} = ua_parser(req.headers['user-agent']);
	const devtype = !type ? 'desktop' : 'mobile';
	if (name === 'Mobile Safari')
		name = 'MobileSafari';
	console.log('name', name);
	console.log('type', type);
	Book.update({title: req.query.title}, {$push:{[name]:{cfi, progress, size, devtype}}}, (err, result)=>{
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

router.get('/remove', (req, res)=>{ //rm by size
	const {id, browser, size, devtype} = req.query;
	Book.update({_id: id}, {$pull:{[browser]: {size, devtype}}}, {safe: true, multi: true}, (err, doc)=>{
		if (err)
			res.send(err);
		res.send(doc);
	});
});

router.get('/clearbrowser', (req, res)=>{
	const {id, browser} = req.query;
	Book.update({_id: 'id'}, {$set: {[browser]:[]}}, (err, docs)=>{
		res.send(docs);
	});
});

module.exports = router;