module.exports=(function(mongoose){
	const Schema = mongoose.Schema;

	const fileSchema = new Schema({
		name: String,
		associatedFileId: Schema.Types.ObjectId
	}, { collection: 'files' })

	return mongoose.model('File', fileSchema) 
})