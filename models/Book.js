const mongoose = require('../db/mongoose');

const bookSchema = mongoose.Schema({
	title:String,
	Chrome:[
		{
			cfi: String,
			progress: Number,
			size: String,
			devtype: String
		}
	],
	Firefox:[
		{
			cfi: String,
			progress: Number,
			size: String,
			devtype: String
		}
	],
	Safari:[
		{
			cfi: String,
			progress: Number,
			size: String,
			devtype: String
		}
	],
	MobileSafari:[
		{
			cfi: String,
			progress: Number,
			size: String,
			devtype: String
		}
	]
});

const Book = mongoose.model('Book', bookSchema);

module.exports = {Book};