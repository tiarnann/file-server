module.exports=(function(mongoose){
	const Schema = mongoose.Schema;

	const fileSchema = new Schema({
		name: String,
		data: Buffer
	}, { collection: 'files' })

	mongoose.model('File', fileSchema) 
})



