module.exports=(function(mongoose){
	const Schema = mongoose.Schema;

	const fileSchema = new Schema({
		name: String,
		relative: String,
		associatedFileId: Schema.Types.ObjectId,
		server: String
	}, { collection: 'files' })

	mongoose.model('File', fileSchema) 
})