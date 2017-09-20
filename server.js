const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'pug');
app.use(express.static('reader'));

app.get('/', (req, res)=>{
	res.render('index');
});

app.get('*', (req, res)=>{
	res.redirect('/');
});

app.listen(port, ()=>console.log('server is running on port', port));