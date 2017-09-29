const mongoose = require('../db/mongoose');

const bookSchema = mongoose.Schema({
	title:String,
	Chrome:[
		{
			cfi: String,
			progress: Number,
			size: String,
			type: String
		}
	],
	Firefox:[
		{
			cfi: String,
			progress: Number,
			size: String,
			type: String
		}
	],
	Safari:[
		{
			cfi: String,
			progress: Number,
			size: String,
			type: String
		}
	],
	MobileSafari:[
		{
			cfi: String,
			progress: Number,
			size: String,
			type: String
		}
	]
});

const Book = mongoose.model('Book', bookSchema);

module.exports = {Book};