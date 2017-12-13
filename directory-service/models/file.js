module.exports=(function(mongoose){
	const Schema = mongoose.Schema;

	const fileSchema = new Schema({
		name: String,
		relative: String,
		associatedFileId: Schema.Types.ObjectId,
		server: String,
		locked: {type: Boolean, default: false}
	}, { collection: 'files' })

	mongoose.model('File', fileSchema) 
})