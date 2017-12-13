module.exports=(function(mongoose){
	const Schema = mongoose.Schema;

	const fileSchema = new Schema({
		name: String,
		relative: String
	}, { collection: 'files' })

	mongoose.model('File', fileSchema) 
})



