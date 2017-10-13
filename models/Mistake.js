const mongoose = require('mongoose');

const mistakeSchema = mongoose.Schema({
	title: String,
	quote: String,
	comment: String
});

const Mistake = mongoose.model('Mistake', mistakeSchema);
module.exports = {Mistake};
