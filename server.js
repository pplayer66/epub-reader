const express = require('express');
const mongoose = require('./db/mongoose');
const ua_parser = require('ua-parser-js');

const app = express();
const port = process.env.PORT || 3000;
const book = require('./routes/books');

app.set('view engine', 'pug');
app.use(express.static('reader'));

app.get('/', (req, res)=>{
	res.redirect('/reader');
});

app.get('/dropdb', (req, res)=>{
	mongoose.connection.db.dropDatabase(()=>{
		res.send('database has been dropped');
	});
});

app.get('/reader', (req, res)=>{
	res.render('index', {bookmarks: ['epubcfi(/6/12[id251]!/4/2[calibre_toc_4]/1:0)', 'epubcfi(/6/14[id250]!/4/38/1:0)', 'epubcfi(/6/22[id246]!/4/110/1:0)']});
});

// app.use('/reader/addbookmark', (req, res)=>{
// 	res.send({bookmark: req.query.bm});
// });

app.use('/book', book);

app.get('/device', (req, res)=>{
	const {device:{type}} = ua_parser(req.headers['user-agent']);
	res.send(type);

});

app.get('/browser', (req, res)=>{
	var ua = ua_parser(req.headers['user-agent']);
	res.send(ua.browser.name);
});

app.get('*', (req, res)=>{
	res.redirect('/reader');
});



app.listen(port, ()=>console.log('server is running on port', port));

