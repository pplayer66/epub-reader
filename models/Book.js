const mongoose = require('../db/mongoose');

const bookSchema = mongoose.Schema({
	title:String,
	total: Number,
	Chrome: [
		{
			cfi: String,
			progress: Number
		}
	],
	Firefox: [
		{
			cfi: String,
			progress: Number
		}
	],
	Safari: [
		{
			cfi: String,
			progress: Number
		}
	],
});

const Book = mongoose.model('Book', bookSchema);

module.exports = {Book};