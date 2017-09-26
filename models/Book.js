const mongoose = require('../db/mongoose');

const bookSchema = mongoose.Schema({
	title:String,
	Chrome:[
		{
			cfi: String,
			progress: Number,
			size: String
		}
	],
	Firefox:[
		{
			cfi: String,
			progress: Number,
			size: String
		}
	],
	Safari:[
		{
			cfi: String,
			progress: Number,
			size: String
		}
	]
});

const Book = mongoose.model('Book', bookSchema);

module.exports = {Book};