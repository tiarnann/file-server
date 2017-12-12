const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileSchema = new Schema({
	name: String,
	username: String,
	password: String
}, { collection: 'files' })

module.exports=mongoose.model('User', fileSchema) 