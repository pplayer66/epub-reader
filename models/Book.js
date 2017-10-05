const mongoose = require('../db/mongoose');

const bookSchema = mongoose.Schema({
	title: String,
	chapters:[
		{
			chapter: String,
			cfi: String,
			progress: Number,
			chapterTitle: String
		}
	]
});

const Book = mongoose.model('Book', bookSchema);

module.exports = {Book};