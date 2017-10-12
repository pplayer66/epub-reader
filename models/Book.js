const mongoose = require('../db/mongoose');

const bookSchema = mongoose.Schema({
	title: String,
	chapters:[
		{
			cfi: String,
			chapterLength: Number,
			chapterProgress: Number,
			label: String
		}
	]
});

const Book = mongoose.model('Book', bookSchema);

module.exports = {Book};