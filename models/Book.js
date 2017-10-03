const mongoose = require('../db/mongoose');

const bookSchema = mongoose.Schema({
	title: String,
	chapters:[
		{
			chapter: String,
			progress: Number
		}
	]
});

const Book = mongoose.model('Book', bookSchema);

module.exports = {Book};