module.exports=(function(mongoose){
	const Schema = mongoose.Schema;

	const fileSchema = new Schema({
		'data': Buffer
	}, { collection: 'files' })

	return mongoose.model('File', fileSchema) 
})



