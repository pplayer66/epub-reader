const mongoose = require('mongoose');

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