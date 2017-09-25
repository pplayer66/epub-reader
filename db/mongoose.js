const mongoose = require('mongoose');

const {dbport: port} = require('../config/db');

mongoose.promise = global.Promise;

mongoose.connect(port, ()=>console.log('Connected to database'));

module.exports = mongoose;
