const mongoose = require('../db/mongoose');

const bookSchema = mongoose.Schema({
	title:
	{
		type: String,
	},
	total: Number,
	pages: [
		{
			cfi: String,
			progress: Number
		}
	]
});

const Book = mongoose.model('Book', bookSchema);

module.exports = {Book};