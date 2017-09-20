const express = require('express');

const app = express();
const port = process.env.PORT || 2000;

app.set('view engine', 'pug');
app.use(express.static('reader'));

app.get('/reader', (req, res)=>{
	res.render('index');
});

app.listen(port, ()=>console.log('server is running on port', port));